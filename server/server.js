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
      const userQuery = 'select user_name,email,password,r.role_id,r.role_name from users inner join roles r on users.role_id=r.role_id where user_name = ? and password = ?';
      dbConn.query(userQuery, [userName,password], (err,result)=>{
        if(err) throw err;
        //if user exists

        if(result.length>0){
          return res.json(result[0]);
        }
        else{
          return res.json({error: "invalid username and/or password"});
        }
      });

    }catch(err){throw err;};
    
}
else{
  return res.json({error: "Please enter username and password!"});
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
            // const dbFields = await createUpdateFormFields(fields, sectionId);
            // section.fields = dbFields;
            resolve(section);
          }
        });
      } else {
        // If sectionId is not available then it is an insert query for sections
        dbConn.query(sectionInsertQuery, [sectionLabel, sectionOrder, formId], async (err, result) => {
          if (err) {
            throw err;
          } else {
            section.sectionId = result.insertId;
            // const dbFields = await createUpdateFormFields(fields, sectionId);
            // section.fields = dbFields;
            resolve(section);
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
    });

  } else {
    throw { error: "emtpy Form" };
  }
})