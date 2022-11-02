const inquirer = require('inquirer');
const dbConnect = require("./config/connection");
const express = require('express');

dbConnect.connect((err) => {
    if (err) throw err;
   
});

console.log('WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM')
const promptUser = () => {
    inquirer
        .prompt(
            {
                type: 'list',
                name: 'start',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'View employees by Manager', 'Add a department', 'Add a role', 'Add an employee', 
                'Update an employee\'s role', 'Delete existing employee','Delete an existing role', 'Delete an existing department',
                'Exit']
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
            if (answers.start === 'View employees by Manager') {
                getEmployeesByManager();
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
            if (answers.start === 'Delete existing employee') {
                deleteEmployee();
            };
            if (answers.start === 'Delete an existing role') {
                deleteRole();
            };
            if (answers.start === 'Delete an existing department') {
                    deleteDepartment();
                };
            if (answers.start === 'Exit') {
                dbConnect.end();
            };
        })
    }
//////////////////////////////
// FUNCTIONS //
/////////////////////////////

// VIEW FUNCTIONS

async function getAllEmployees () {
    let table = await `SELECT id, first_name, last_name, role_id, title
                FROM employees ORDER BY last_name ASC;`;
     dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log(`\nCurrent Employees:\n`);
        console.table(response);
    });      promptUser();
};

async function getAllDepartments () {
    let table =  `SELECT *
                FROM department ORDER BY dept_id ASC;`;
                dbConnect.query(table, (err, response) => {
                    if (err) throw err;
                    console.log(`\nAll Departments:\n`);
                    console.table(response);
                  
                });     promptUser();
    };

async function getAllRoles () {
    let table = `SELECT *
                FROM role ORDER BY role_id ASC`;
        dbConnect.query(table, (err, response) => {
        if (err) throw err;
        console.log(`\nAll Roles:\n`);
        console.table(response);

        });     promptUser();
};

async function getEmployeesByManager () {
    let managers = [];
    let managerTable = `SELECT first_name,last_name, title, role_id 
                FROM employees WHERE title LIKE '%Manager%'`;
    dbConnect.query(managerTable, (err, response) => {
        if (err) throw err;
        response.forEach((employees) => {
            managers.push(`${employees.first_name} ${employees.last_name}`); 
    });
   inquirer 
     .prompt ([
    {   type: 'list', 
        name: 'managerSelected',
        message: 'What is the name of the Manager?',
        choices: managers
    }
    ]).then ((answer) => {
    let managerSelected = answer.managerSelected;
    console.log(managerSelected);
    let managerTable = `SELECT * FROM employees_db.employees WHERE manager_name = ?`
         dbConnect.query(managerTable, managerSelected, (err, response) => {
        if (err) throw err;
        console.log(`\nEmployees under Manager ${managerSelected}:`);
        console.table(response);
        promptUser();
    })})
})};


// ADD FUNCTIONS //

async function addDept () {
const question = inquirer 
    .prompt ([
    {
        type: 'input', 
        name: 'deptName',
        message: 'What is the name of the department? (Use ALL CAPS.)',
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
      console.log(`\n${newDept} added!\n`)
      getAllDepartments();
        })
    })
};

async function addRole () {
    let deptChoices = []
    let table = `SELECT * FROM department ORDER BY name ASC;`
    dbConnect.query(table, (err, response) => {
      if (err) throw err;
       response.forEach((department) => {
           deptChoices.push(`${department.dept_id} ${department.name}`)
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
            console.log(`\n${answers.roleName} added!\n`);
            getAllRoles();
        }))
     });  
  });    
}; 

async function addEmployee () {
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
            managers.push(`${employees.first_name} ${employees.last_name} ${employees.title}`, 'none'); 
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
    let managerName
    if (answers.employeeManager === 'none') {
        managerName = '';
    } else {
    managerName = answers.employeeManager.split(' ').slice(0, 2).join(' ');
    };
    let role_id
    let title = answers.employeeRole;
    let rolesTable = `SELECT * FROM role ORDER BY title ASC;`;
    dbConnect.query(rolesTable, (err, response) => {
        response.forEach((role) => {
            if (title === role.title) {
            role_id = role.role_id;
    let answersArray = [answers.employeeFirstName, answers.employeeLastName, role_id, title, managerName];
    console.log(`Answers array ${answersArray}`);
    const newEmpTable = `INSERT INTO employees (first_name, last_name, role_id, title, manager_name) VALUES (?, ?, ?, ?, ?);`;
    dbConnect.query(newEmpTable, answersArray, ((err) => {
        if (err) throw err;
        console.log(`\n${answers.employeeFirstName} ${answers.employeeLastName} added!\n`);
        getAllEmployees();
    }));
    }})}
)})})})};

// UPDATE FUNCTION // 

async function updateEmployeeRole () {
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
    }});

    const updateEmpArray = [newRoleId, newRole, employeeIdToUpdate]
    let selectedEmployee = `UPDATE employees 
                            SET employees.role_id = ? and SET employees.title = ? WHERE 
                            employees.id = ?`
       dbConnect.query(selectedEmployee, updateEmpArray, (err) => {
      if (err) throw err;
      console.log('\nEmployee role has been updated.\n');
        getAllEmployees();
        })
    })
})})
}

// DELETE FUNCTIONS //

async function deleteEmployee () {
    let employeeList = []
    let employeesTable = `SELECT first_name, last_name, id FROM employees ORDER BY title ASC;`;
    dbConnect.query(employeesTable, (err, response) => {
        if (err) throw err;
        response.forEach((employees) => {
            employeeList.push(`${employees.first_name} ${employees.last_name}`);
    });
    const question = inquirer 
        .prompt ([
        {
            type: 'list', 
            name: 'employeeToUpdate',
            message: 'Which employee would you like to delete?',
            choices: employeeList
        }
    ]) .then((answer) => {
        let employeeToDelete = answer.employeeToUpdate
        console.log(employeeToDelete)
        let table = `DELETE FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?`;
        dbConnect.query(table, employeeToDelete, (err) => {
          if (err) throw err;
          console.log(`\n${employeeToDelete} has been deleted from system.\n`)
          getAllEmployees();
        })
        })
    })};


async function deleteRole () {
    let roleList = []
    let roleTable = `SELECT title FROM role ORDER BY title ASC;`;
    dbConnect.query(roleTable, (err, response) => {
        if (err) throw err;
        response.forEach((role) => {
            roleList.push(`${role.title}`);
    });
    const question = inquirer 
        .prompt ([
        {
            type: 'list', 
            name: 'roleToDelete',
            message: 'Which role would you like to delete?',
            choices: roleList
        }
    ]) .then((answer) => {
        let roleToDelete = answer.roleToDelete;
        let table = ` DELETE FROM role WHERE title = ?`;
        dbConnect.query(table, roleToDelete, (err) => {
            if (err) throw err;
            console.log(`\n${roleToDelete} has been deleted from the system.\n`)
            getAllRoles();
        })
        })
    })};

async function deleteDepartment () {
        let departmentList = []
        let departmentTable = `SELECT name FROM department ORDER BY name ASC;`;
        dbConnect.query(departmentTable, (err, response) => {
            if (err) throw err;
            response.forEach((department) => {
                departmentList.push(`${department.name}`);
        });
        const question = inquirer 
            .prompt ([
            {
                type: 'list', 
                name: 'deptToDelete',
                message: 'Which department would you like to delete?',
                choices: employeeList
            }
        ]) .then((answer) => {
            let deptToDelete = answer.deptToDelete;
            let table = ` DELETE FROM department WHERE name = ?`;
            dbConnect.query(table, deptToDelete, (err) => {
              if (err) throw err;
              console.log(`\n${deptToDelete} has been deleted from the system.\n`)
              getAllDepartments();
            })
            })
        })};


promptUser();


