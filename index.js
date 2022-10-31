const inquirer = require('inquirer');
const fs = require('fs');
const dbConnect = require("./config/connection");
const express = require('express');
const { get } = require('https');
const { isArray } = require('util');
const app = express();

dbConnect.connect((err) => {
    if (err) throw err;
});

const promptUser = () => {
    console.log('WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM');
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'start',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee\'s role', 'Exit']
            })
        .then((answers) => {
            if (answers.start === 'View all departments') {
                getAllDepartments();
            };
            if (answers.start === 'View all roles') {
                getAllRoles();
            };
            if (answers.start === 'View all employees') {
                getAllEmployees();
            };
            if (answers.start === 'View all departments') {
                getAllDepartments();
            };
            if (answers.start === 'Add a department') {
                addDept();
            };
            if (answers.start === 'Add a role') {
                addRole();
            };
            if (answers.start === 'Add an employee') {
                addEmployee();
            };
            if (answers.start === 'Update an employee\'s role') {
                updateEmployeeRole();
            };
            if (answers.start === 'Exit') {
                dbConnect.end();
            };
        })
    }
//////////////////////////////
// FUNCTIONS //
/////////////////////////////

// VIEW-ALL FUNCTIONS

const getAllEmployees = () => {
    let table = `SELECT id, first_name, last_name, role_id, title
                FROM employees ORDER BY last_name ASC;`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log('Current Employees:');
        console.table(response);
        promptUser();
    });
};

const getAllDepartments = () => {
    let table =  `SELECT *
                FROM department ORDER BY dept_id ASC;`;
                dbConnect.query(table, (err, response) => {
                    if (err) throw err;
                    console.log('All Departments:');
                    console.table(response);
                    promptUser();
                });
    };

const getAllRoles = () => {
    let table = `SELECT *
                FROM role ORDER BY role_id ASC;`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log('All Roles:');
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
    },
    {
    type: 'input', 
    name: 'deptId',
    message: 'What is the new department\'s ID?',
    }
]) .then((answer) => {
    let newDept = [answer.deptName, answer.deptId]
    let table = `INSERT INTO department (name, dept_id) VALUES (?, ?)`;
    dbConnect.query(table, newDept, (err) => {
      if (err) throw err;
      getAllDepartments();
        })
    })
};

const addRole = () => {
    let deptChoices = []
    let table = `SELECT * FROM department ORDER BY name ASC;`
    dbConnect.query(table, (err, response) => {
      if (err) throw err;
       response.forEach((department) => {
           deptChoices.push(`(${department.dept_id}) ${department.name}`)
        })

    inquirer 
        .prompt ([
        {
            type: 'input', 
            name: 'roleName',
            message: 'What is the name of the role?',
        },
       {
            type: 'input', 
            name: 'roleSalary',
            message: 'What is the salary of the role?'
         },
        {  
            type: 'list', 
            name: 'roleDepartment',
            message: 'Which department does the role belong to?',
            choices: deptChoices
        }
     ]).then ((answers) => {
        let dept_id = answers.roleDepartment.split(' ')[0];    
        let answersArray = [answers.roleName, answers.roleSalary, dept_id];
        let table = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        dbConnect.query(table, answersArray, ((err) => {
            if (err) throw err;
            console.log('New role added successfully.');
            getAllRoles();
        }))
     });  
  });    
}; 

function addEmployee () {
    let roles = []
    let rolesTable = `SELECT * FROM role ORDER BY title ASC;`;
    dbConnect.query(rolesTable, (err, response) => {
        if (err) throw err;
        response.forEach((role) => {
            roles.push(`${role.title}`);
    });
    let managers = [];
    let managerTable = `SELECT first_name,last_name, title, role_id 
                FROM employees WHERE title LIKE '%Manager%'`;
    dbConnect.query(managerTable, (err, response) => {
        if (err) throw err;
        response.forEach((employees) => {
            managers.push(`${employees.first_name} ${employees.last_name} (${employees.title})`); 
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
        choices: roles
    },
    {   
        type: 'list', 
        name: 'employeeManager',
        message: `Who is the employee's manager?`,
        choices: managers

    },
  ])
  .then ((answers) => {
    const managerName = answers.employeeManager
    console.log(managerName);
    let role_id
    let title = answers.employeeRole;
    response.forEach((role) => {
        if (title === role.title) {
        role_id = role.role_id;
        console.log(`this is the title ${title}`);
    }});
    let answersArray = [answers.employeeFirstName, answers.employeeLastName, role_id, title, managerName];
    console.log(`Answers array ${answersArray}`);
    const newEmptable = `INSERT INTO employees (first_name, last_name, role_id, title, name_of_manager) VALUES (?, ?, ?, ?, ?);`;
    dbConnect.query(newEmptable, answersArray, ((err) => {
        if (err) throw err;
        console.log('New employee added successfully.');
        getAllEmployees();
    }))
 });
})})}
;
 const updateEmployeeRole = () => {
    let employeeList = []
    let employeesTable = `SELECT first_name, last_name, id FROM employees ORDER BY title ASC;`;
    dbConnect.query(employeesTable, (err, response) => {
        if (err) throw err;
        response.forEach((employees) => {
            employeeList.push(`${employees.first_name} ${employees.last_name} ${employees.id}`);
    });
    let roles = []
    let rolesTable = `SELECT * FROM role ORDER BY title ASC;`;
    dbConnect.query(rolesTable, (err, response) => {
        if (err) throw err;
        response.forEach((role) => {
            roles.push(`${role.role_id} - ${role.title}`);
    });
    inquirer 
        .prompt ([
        {
            type: 'list',
            name: 'employeeToUpdate',
            message: 'Which employee would you like to update?',
            choices: employeeList
        },
        {
            type: 'list', 
            name: 'employeeNewRole',
            message: `Which role do you want to assign the employee?`,
            choices: roles
        },
]) .then((answers) => {
    const employeeIdToUpdate = answers.employeeToUpdate.split('')[2];
    const newRoleId = answers.employeeNewRole.split(' ')[0];
    let newRole;
    response.forEach((role) => {
        if (newRoleId === role.role_id) {
        newRole = role.title;
        console.log(`this is the new role ${newrole}`);
    }});

    const updateEmpArray = [newRoleId, newRole, employeeIdToUpdate]
    let selectedEmployee = `UPDATE employees 
                            SET employees.role_id = ? and SET employees.title = ? WHERE 
                            employees.id = ?`
       dbConnect.query(selectedEmployee, updateEmpArray, (err) => {
      if (err) throw err;
      console.log('Employee has been updated successfully.');
        getAllEmployees();
        })
    })
})})
}
promptUser();


