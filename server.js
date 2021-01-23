const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

// create connection
let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employees_db"
});
// connect
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.clear();
    init();

});
// Display Logo and get Initial Action Choice
function init() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do?",
            choices: ["ADD department, employee or role", "VIEW all departments, roles, roles by department, all employees, employees by manager or department buggets", "UPDATE employee manager or employee role", "DELETE employee, role or department", "QUIT"]
        }
    ]).then((response) => {
        switch (response.options) {
            case "ADD department, employee or role":
                inquirer.prompt([
                    {
                        type: "list",
                        name: "add",
                        message: "What would you like to add?",
                        choices: ["ADD Department", "ADD Role", "ADD Employee","BACK"]
                    }
                ]).then((response) => {
                    switch (response.add) {
                        case "ADD Employee":
                            addEmployee();
                            break;
                        case "ADD Role":
                            addRole();
                            break;
                        case "ADD Department":
                            addDepartment();
                            break;
                        case "BACK":
                            init();
                            break;
                    }
                });
            case "VIEW all departments, roles, roles by department, all employees, employees  by manager or department buggets":
                inquirer.prompt([
                    {
                        type: "list",
                        name: "view",
                        message: "What would you like to view?",
                        choices: ["View All Departments", "View All Roles", "View All Roles by Department", "View all Employees", "View Employee by Manager","Get Utilized Budget by Department","BACK"]
                    }
                ]).then((response) => {
                    switch (response.view) {
                        case "View All Departments":
                            viewAllDepts();
                            break;
                        case "View All Roles":
                            viewAllRoles();
                            break;
                        case "View all Employees":
                            viewAllEmployees();
                            break;
                        case "View All Roles by Department":
                            viewRolesByDept();
                            break;
                        case "View Employee by Manager":
                            viewEmployeesByManager();
                            break;
                        case "Get Utilized Budget by Department":
                            getUtilizedBudget();
                            break;
                        case "BACK":
                            init();
                            break;
                    }
                });
            case "UPDATE employee manager or employee role":
                inquirer.prompt([
                    {
                        type: "list",
                        name: "update",
                        message: "What would you like to update?",
                        choices: ["Update Employee Manager", "Update Employee Role","BACK"]
                    }
                ]).then((response) => {
                    switch (response.update) {
                        case "Update Employee Manager":
                            updateManager();
                            break;
                        case "Update Employee Role":
                            updateEmployeeRole();
                            break;
                        case "BACK":
                            init();
                            break;
                    }
                });
            case "DELETE employee, role or department":
                inquirer.prompt([
                    {
                        type: "list",
                        name: "delete",
                        message: "What would you like to delete?",
                        choices: ["Delete Employee", "Delete Role", "Delete Department","BACK"]
                    }
                ]).then((response) => {
                    switch (response.delete) {
                        case "Delete Employee":
                            deleteEmployee();
                            break;
                        case "Delete Role":
                            deleteRole();
                            break;
                        case "Delete Department":
                            deleteDepartment();
                            break;
                        case "BACK":
                            init();
                            break;
                    }
                });
            case "QUIT":
                console.log("Till next time!");
                connection.end();
                break;
            default:
                console.log("Please respond with valid selection.")
                init();
                break;    
        };    
    });
};