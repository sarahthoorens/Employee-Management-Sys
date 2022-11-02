# Employee Management System
CLI employee tracker using sql, node and inquirer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


  **Completion Date:**  11/1/22
  
  **WALK-THROUGH CAN BE FOUND HERE:**
  
  **Technologies used:**  Node.js, JavaScript, npm Inquirer package, mySql2 <br>
  **Project goal:**  Create a command-line <br>


  ## Table of Contents
  1. [Project Description](#Description)
  2. [Installation](#Installation)
  3. [Usage](#Usage)
  4. [Contribution Guidelines](#Contributing)
  5. [Challenges and Thoughts](#Challenges)
  6. [Tests](#Tests)
  7. [License](#License)
  <br>
  
  ## Description

  The instructions for this project were to create a CMS-style interface to allow non-developers to interact with information stored in an employee database. Requirements were to build a command-line application and three databases from scratch using Node.js, Inquirer, and MySQL to manage a company's employee information. 

  The following information was provided:
  
  ### User Story
    

        AS A business owner
        I WANT to be able to view and manage the departments, roles, and employees in my company
        SO THAT I can organize and plan my business
 

### Acceptance Criteria

        GIVEN a command-line application that accepts user input
        WHEN I start the application
        THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        WHEN I choose to view all departments
        THEN I am presented with a formatted table showing department names and department ids
        WHEN I choose to view all roles
        THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
        WHEN I choose to view all employees
        THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
        WHEN I choose to add a department
        THEN I am prompted to enter the name of the department and that department is added to the database
        WHEN I choose to add a role
        THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
        WHEN I choose to add an employee
        THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
        WHEN I choose to update an employee role
        THEN I am prompted to select an employee to update and their new role and this information is updated in the database 


## Installation

To implement this program, you'll need to require node and install the inquirer package on npm. The server.js file with the command line prompt questions will need to be accessible in the current working directory, and the mysql databases will need to be accessible and populated from the db folder. The application requires local connection to mysql.

## Usage 

In VSCode, navigate to the server.js file, open the integrate terminal and enter node server.js. The employee database interface will populate and present user with options to interact with the data.

## Contributing

Contributions are welcome. My contact information is below.

## Challenges 

I fully enjoy working on database projects. Setting up the data was quick and straightforward. While figuring out new ways to manipulate and interact with the data is satisfying work, configuring the logic for each condition was the most challenging part of this project. However, once I determined the main syntax for each add, view and delete option, it was mostly a matter of small reconfigurations for every instance. I think my approach could have been more streamlined, but I'm happy with the work done.

I was able to implement the required functions as well as the "select employees by manager" and three "delete" options. When I have more time, I intend to return to complete the other bonus functions. For future development, I'd like to make the CLI interface a little more user-friendly by adding formatting to the data using something like figlet. I'd also like to reorganize the code to separate queries from index.js.

## Tests

No tests were written for this program.

## License

Click the badge to learn more about the license used for this project.
<br>[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Questions?

Find me on GitHub at: https://github.com/sarahthoorens

You can also send any questions about this project to: s.thoorens@gmail.com
