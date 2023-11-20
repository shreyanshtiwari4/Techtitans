const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));

const PORT = 3010;

const dbConn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quizz'
});

dbConn.connect((err) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log("connected successfully");
  }
})

app.listen(PORT, () => {
  console.log(`listening to port: ${PORT}`);
});

/*Adding new user*/

app.post("/newUser", (req, res) => {
  const { userName, pass, email, roleId } = req.body;
  const sql = 'insert into users(user_name,password,email,role_id) values(?,?,?,?)';
  dbConn.query(sql, [userName, pass, email, roleId], (err, result) => {
    if (err) {
      throw err;
    }
    else {
      res.send("inserted");
    }
  });
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;
  if (userName && password) {
    try {
      res.setHeader("Content-Type", "application/json");
      const userQuery = 'select user_name,email,password,r.role_id,r.role_name from users inner join roles r on users.role_id=r.role_id where user_name = ? or email = ? and password = ?';
      dbConn.query(userQuery, [userName, userName, password], (err, result) => {
        if (err) throw err;
        //if user exists

        if (result.length > 0) {
          return res.json(result[0]);
        }
        else {
          return res.json({ error: "invalid username and/or password" });
        }
      });

    } catch (err) { throw err; };

  }
  else {
    return res.json({ error: "Please enter username and password!" });
  }
});


app.post("/newForm", (req, res) => {
  const formName = req.body.formName;
  const typeId = req.body.typeId;
  const createdBy = req.body.createdBy;
  const createdDate = new Date();
  const sql = 'insert into form(form_name,type_id,created_by,created_on) values(?,?,?,?)';

  dbConn.query(sql, [formName, typeId, createdBy, createdDate], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const formData = {
        formId: result.insertId,
        formName,
        typeId,
        createdBy,
        createdDate
      }
      res.send(formData);
    }
  });
});

/**
 * @function createUpdateFieldOptions - create form field options
 * @param {*} fields - List of fields
 */
const createUpdateFieldOptions = async (options, fieldId) => {
  const optionInsertQuery = 'insert into field_options(OPTION_LABEL, IS_CORRECT, FIELD_ID) values(?, ?, ?)';
  const optionUpdateQuery = 'update field_options set OPTION_LABEL = ?, IS_CORRECT = ? where option_id = ?';

  if (options?.length) {
    const fieldOptionPromises = await options?.map((option) => new Promise((resolve, reject) => {
      const { optionId, optionLabel, isCorrect } = option;

      if (optionId) {
        // If optionId is available then it is an update query for options
        dbConn.query(optionUpdateQuery, [optionLabel, isCorrect, optionId], (err) => {
          if (err) {
            throw err;
          } else {
            resolve(option);
          }
        });
      } else {
        // If optionId is not available then it is an insert query for options
        dbConn.query(optionInsertQuery, [optionLabel, isCorrect, fieldId], (err, result) => {
          if (err) {
            throw err;
          } else {
            option.optionId = result.insertId;
            option.fieldId = fieldId;
            resolve(option);
          }
        });
      }
    }));

    // Resolving All promise and wait till all promises get resolve;
    return fieldOptionPromises
  } else {
    return new Promise();
  }
}

/**
 * @function createFormFields - create form fields
 * @param {*} fields - List of fields
 */
const createUpdateFormFields = async (fields, sectionId) => {
  const fieldInsertQuery = 'insert into form_fields (field_primary_data, field_secondary_data, field_type_id, section_id, is_required) values (?,?,?,?,?)';
  const fieldUpdateQuery = 'update form_fields set field_primary_data = ?, field_secondary_data = ?, field_type_id = ?, is_required = ? where field_id = ?';

  if (fields?.length) {
    const fieldPromise = await fields?.map((field) => new Promise((resolve, reject) => {
      const { fieldPrimaryData, fieldSecondaryData, fieldTypeId, isRequired, fieldId, options } = field;

      if (fieldId) {
        // If fieldId is available then it is an update query for fields
        dbConn.query(fieldUpdateQuery, [fieldPrimaryData, fieldSecondaryData, fieldTypeId, isRequired, fieldId], async (err, result) => {
          if (err) {
            throw err;
          } else {
            field.sectionId = sectionId;
            if (fieldTypeId == 1) {
              const dbOptionPromise = await createUpdateFieldOptions(options, fieldId);
              await Promise.all(dbOptionPromise).then((resolvedOptionList) => {
                field.options = resolvedOptionList;
                resolve(field);
              }).catch((err) => {
                throw err;
              });

            } else {
              field.options = [];
              resolve(field);
            }
          }
        });
      } else {
        // If fieldId is not available then it is an insert query for fields
        dbConn.query(fieldInsertQuery, [fieldPrimaryData, fieldSecondaryData, fieldTypeId, sectionId, isRequired], async (err, result) => {
          if (err) {
            throw err;
          } else {
            field.fieldId = result.insertId;
            field.sectionId = sectionId;
            if (fieldTypeId == 1) {
              const dbOptionPromise = await createUpdateFieldOptions(options, result.insertId);
              await Promise.all(dbOptionPromise).then((resolvedOptionList) => {
                field.options = resolvedOptionList;
                resolve(field);
              }).catch((err) => {
                throw err;
              });
            }
            else{
              field.options = [];
              resolve(field);
            }
          }
        });
      }
    }));

    return fieldPromise;
  } else {
    return new Promise();
  }
}

/**
 * @function createUpdateFormSections - create or update form fields
 * @param {*} fields - List of fields
 */
const createUpdateFormSections = async (sections, formId) => {
  const sectionInsertQuery = "insert into sections(section_label, section_order, form_id) values(?,?,?)";
  const sectionUpdateQuery = "update sections set section_label = ?, section_order = ? where section_id = ?";

  if (sections?.length) {
    const sectionPromise = await sections?.map((section) => new Promise((resolve, reject) => {
      const { sectionId, sectionLabel, sectionOrder, fields } = section;

      if (sectionId) {
        // If sectionId is available then it is an update query for sections
        dbConn.query(sectionUpdateQuery, [sectionLabel, sectionOrder, sectionId], async (err, result) => {
          if (err) {
            throw err;
          } else {
            // Will check for the list of fields and create new fields
            const dbFieldsPromise = await createUpdateFormFields(fields, sectionId);
            await Promise.all(dbFieldsPromise).then((resolvedFieldList) => {
              section.fields = resolvedFieldList;
              resolve(section);
            }).catch((err) => {
              throw err;
            });
          }
        });
      } else {
        // If sectionId is not available then it is an insert query for sections
        dbConn.query(sectionInsertQuery, [sectionLabel, sectionOrder, formId], async (err, result) => {
          if (err) {
            throw err;
          } else {
            section.sectionId = result.insertId;
            const dbFieldsPromise = await createUpdateFormFields(fields, section.sectionId);
            await Promise.all(dbFieldsPromise).then((resolvedFieldList) => {
              section.fields = resolvedFieldList;
              resolve(section);
            }).catch((err) => {
              throw err;
            });
          }
        });
      }
    }));
    return sectionPromise;
  } else {
    return new Promise();
  }
}

app.post("/submitFormDetails", async (req, res) => {

  const formData = req.body;
  console.log(formData);
  if (formData) {
    const { sections, formId } = formData;
    const _sectionListPromise = await createUpdateFormSections(sections, formId);

    // Resolving All promise and wait till all promises get resolve;
    await Promise.all(_sectionListPromise).then((sectionList) => {
      const responseFormData = { ...formData };
      responseFormData.sections = sectionList;

      res.send({ data: responseFormData });
    }).catch((err) => {
      throw err;
    });

  } else {
    throw { error: "emtpy Form" };
  }
});

const formulateOptions = (options) => {
  const optionFieldInstance = {};
  options?.forEach(option => {
    const _option = {
      optionId: option.OPTION_ID,
      fieldId: option.FIELD_ID,
      optionLabel: option.OPTION_LABEL,
      isCorrect: option.IS_CORRECT
    }
    if (optionFieldInstance[option.FIELD_ID]) {
      optionFieldInstance[option.FIELD_ID].push(_option);
    } else {
      optionFieldInstance[option.FIELD_ID] = [_option];
    }
  });
  return optionFieldInstance;
}

const formulateFields = (fields) => {
  const fieldSectionInstance = {};
  fields?.forEach(field => {
    if (fieldSectionInstance[field.sectionId]) {
      fieldSectionInstance[field.sectionId].push(field);
    } else {
      fieldSectionInstance[field.sectionId] = [field];
    }
  });
  return fieldSectionInstance;
}

const getFieldsOptions = (fields) => {
  const optionSelectionQuery = "select * from field_options where field_id in (?)";
  const fieldIds = fields?.map(field => field.FIELD_ID);

  if (fieldIds?.length) {
    return new Promise((resolve, reject) => {
      dbConn.query(optionSelectionQuery, [fieldIds], (err, result) => {
        if (err) {
          throw err;
        } else {
          resolve(result);
        }
      });
    });
  } else {
    return new Promise((resolve) => {
      resolve([]);
    })
  }
}

const getSectionFields = (sections) => {
  const fieldSelectionQuery = "select * from form_fields where section_id in (?)";

  const sectionIds = sections?.map(section => section.SECTION_ID);

  return new Promise((resolve, reject) => {
    dbConn.query(fieldSelectionQuery, [sectionIds], async (err, result) => {
      if (err) {
        throw err;
      } else {
        // get fields options
        const fieldList = [];
        const _optionList = await getFieldsOptions(result);
        const _fieldOptionInstance = formulateOptions(_optionList);
        result?.forEach((fieldItem) => {
          const _field = {
            fieldId: fieldItem.FIELD_ID,
            sectionId: fieldItem.SECTION_ID,
            fieldPrimaryData: fieldItem.FIELD_PRIMARY_DATA,
            fieldSecondaryData: fieldItem.FIELD_SECONDARY_DATA,
            fieldTypeId: fieldItem.FIELD_TYPE_ID,
            isRequired: fieldItem.IS_REQUIRED
          };
          _field.options = _fieldOptionInstance[fieldItem.FIELD_ID];
          fieldList.push(_field);
        });
        resolve(fieldList);
      }
    });
  });
}

const getSectionDetails = (formId) => {
  const sectionSelectQuery = "select * from sections where form_id = ?";

  return new Promise((resolve, reject) => {
    dbConn.query(sectionSelectQuery, [formId], async (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result?.length) {
          const sectionList = [];
          const fieldList = await getSectionFields(result);
          const _sectionFieldInstance = formulateFields(fieldList);
          result?.forEach((section) => {
            const _section = {
              sectionId: section.SECTION_ID,
              formId: section.FORM_ID,
              sectionLabel: section.SECTION_LABEL,
              sectionOrder: section.SECTION_ORDER
            };
            _section.fields = _sectionFieldInstance[section.SECTION_ID];
            sectionList.push(_section);
          });
          resolve(sectionList);
        }
        else{
          resolve([]);
        }
      }
    });
  });
}

app.post("/getFormDetails", (req, res) => {

  const bodyData = req?.body;
  if (bodyData) {
    const { formId, userId } = bodyData;
    const formSelect = "select * from form where form_id = ?";

    dbConn.query(formSelect, [formId], async (err, result) => {
      if (err) {
        throw err;
      } else {
        const formDetails = { ...result[0] };
        const resData = {
          formId: formDetails.FORM_ID,
          formName: formDetails.FORM_NAME,
          createdBy: formDetails.CREATED_BY,
          createdDate: formDetails.CREATED_ON,
          updatedBy: formDetails.UPDATED_BY,
          updatedDate: formDetails.UPDATED_ON,
          typeId: formDetails.TYPE_ID,
        };
        const sectionList = await getSectionDetails(formId);
        if (sectionList?.length) {
          resData.sections = sectionList;
        }
        res.send({ data: resData });
      }
    });
  }
});


