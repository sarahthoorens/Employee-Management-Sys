const inquirer = require('inquirer');
const fs = require('fs');
const dbConnect = require("./config/connection")

dbConnect.connect((err) => {
    if (err) throw err;
    console.log('WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM');
    promptUser();
})

const promptUser = () =>  {inquirer 
    .prompt ([
    {
        type: 'list', 
        name: 'start',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee\'s role', 'Exit']
    },
])
.then((response) => {
    let response = { choices };
    switch (response)  {
        case 'View all departments':    
            getAllDepartments();
        case 'View all roles':
            getAllRoles();
        case 'View all employees':
            getAllEmployees();
        case 'Add a department':
            addDept();
        case 'Add a role':
            addRole();
        case 'Add an employee':
            addEmployee();
        case 'Update an employee\'s role':
            updateEmployeeRole();
        case 'Exit':
            dbConnect.end()

    } 
})}

//////////////////////////////
// FUNCTIONS //
/////////////////////////////

// VIEW-ALL FUNCTIONS

const getAllEmployees = async () => {
    let table = `SELECT
                id, 
                first_name, 
                last_name, 
                title,
                role_id, 
                FROM employees ORDER BY id ASC`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log('Current Employees');
        console.table(response);
        promptUser();
    });
};

const getAllDepartments = async () => {
    let table = `SELECT *
                FROM department ORDER BY id ASC`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log('Departments');
        console.table(response);
        promptUser();
        });
};

const getAllRoles = async () => {
    let table = `SELECT *
                FROM role ORDER BY id ASC`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log('All Roles');
        console.table(response);
        promptUser();
        });
};


// ADD FUNCTIONS //

async function addDept () {
const question = inquirer 
    .prompt ([
    {
        type: 'input', 
        name: 'deptName',
        message: 'What is the name of the department?',
    }
]) .then((answer) => {
    let table = `INSERT INTO department (department_name) VALUES (?)`;
    dbConnect.query(table, answer.deptName, (err) => {
      if (err) throw err;
        })
    })
};

async function addRole () {
    const question = inquirer 
        .prompt ([
        {
            type: 'input', 
            name: 'roleName',
            message: 'What is the name of the role?',
        },
       {
            type: 'input', 
            name: 'roleSalary',
            message: 'What is the salary of the role?',
            choices: getAllRoles()
    
        },
        {  
            type: 'list', 
            name: 'roleDepartment',
            message: 'Which department does the role belong to?',
            choices: getAllDepartments()
        }
       
    ]).then ((answers) => {
        let answersArray = [answers.roleName, answers.roseSalary, answers.roleDepartment];
        console.log(answersArray);
        let table = `INSERT INTO role (name, salary, department_id) VALUES (?, ?, ?)`;
        dbConnect.query(table, answersArray, ( (err) => {
            if (err) throw err;
            console.log('New role added successfully.');
            getAllRoles();
        }))
     });
    };

function addEmployee () {
    let managers = [];
    let table = `SELECT
                first_name, 
                last_name 
                FROM employees WITH title LIKE %Manager%`;
    dbConnect.query(table, (err, response) => {
        console.log(response);
        if (err) throw err;
        managers.push(response); 
    });
    inquirer 
        .prompt ([
    {
        type: 'input', 
        name: 'employeeFirstName',
        message: `What is the employee's first name?`,

    },
    {
        type: 'input', 
        name: 'employeeLastName',
        message: `What is the employee's last name?`,

    },
    {
        type: 'list', 
        name: 'employeeRole',
        message: `What is the employee's role?`,
        choices: getAllRoles()
    },
    {   
        type: 'list', 
        name: 'employeeManager',
        message: `Who is the employee's manager?`,
        choices: managers

    },
  ])
};

async function updateEmployeeRole () {
    const question = inquirer 
        .prompt ([
        {
            type: 'list', 
            name: 'employeeRoleUpdate',
            message: `Which role do you want to assign the employee?`,
            // choices: [refer to roles table]
        },
])
}



