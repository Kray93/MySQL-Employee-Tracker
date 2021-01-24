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
// Initial Choice
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
                            addEmp();
                            break;
                        case "ADD Role":
                            addRole();
                            break;
                        case "ADD Department":
                            addDept();
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
                            viewAllEmp();
                            break;
                        case "View All Roles by Department":
                            viewRolesByDept();
                            break;
                        case "View Employee by Manager":
                            viewEmpByMgr();
                            break;
                        case "Get Utilized Budget by Department":
                            viewBudget();
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
                            updateMgr();
                            break;
                        case "Update Employee Role":
                            updateEmpRole();
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
                            deleteEmp();
                            break;
                        case "Delete Role":
                            deleteRole();
                            break;
                        case "Delete Department":
                            deleteDept();
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
function addEmp() {
    const roleTitle = [];
    const roleArr = [];
    connection.query("SELECT id, title FROM role", (err,res) => {
        if (err) throw err;
        for (i in res) {
            const newRole = {};
            newRole.id = res[i].id;
            newRole.title = res[i].title;
            roleArr.push(newRole);
            roleTitle.push(res[i].title);
        };
        const empName = [];
        const empArr = [];
        connection.query("SELECT id, first_name, last_name FROM employee", (err,res) => {
            if (err) throw err;
            for (i in res) {
                const newEmp = {};
                newEmp.id = res[i].id;
                const full_name = `${res[i].first_name} ${res[i].last_name}`;
                empArr.push(newEmp);
                empName.push(full_name);
            };
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter employee first name: ",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "Enter employee last name: ",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "Enter employee role: ",
                    choices: roleTitle,
                    name: "role_id"
                },
                {
                    type: "confirm",
                    message: "Is this employee going to be a manager?",
                    name: "manager_conf"
                },
                {
                    type: "list",
                    message: "Select manager for employee:",
                    choices: empName,
                    name: "manager_name",
                    when: function (answer) {
                        if (answer.manager_conf === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            ]).then((answer) => {
                let managerID;
                for (i in empArr) {
                    if (answer.manager_name === empArr[i].name){
                        managerID = empArr[i].id;
                    };
                };
                let roleID;
                for (i in roleArr) {
                    if (answer.role_id === roleArr[i].title){
                        roleID = roleArr[i].id;
                    };
                };
                if (answer.manager_conf = true) {
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (${answer.first_name}, ${answer.last_name}, ${roleID}, ${managerID})`, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added!");
                        init();
                    });
                } else {
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (${answer.first_name}, ${answer.last_name}, ${roleID})`, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added!");
                        init();
                    });
                };
            });
        });
    });
};
function addRole() {
    const deptArr = [];
    connection.query("SELECT id, name FROM department;", (err, res) => {
        if (err) throw err;
        for (i in res) {
            roleObj = {};
            roleObj.id = res[i].id;
            roleObj.name = res[i].name;
            deptArr.push(roleObj);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Enter department name for new role: ",
                choices: deptArr,
                name: "deptName"
            },
            {
                type: "input",
                message: "Enter title of new role:",
                name: "roleName"
            },
            {
                type: "number",
                message: "Enter salary of new role:",
                name: "salary"
            }

        ]).then((answer) => {

                // capture department ID of user choice for use in SQL query
                let deptID;
                for (i in deptArr) {
                    if (deptArr[i].name === answer.deptName) {
                        deptID = deptArr[i].id;
                    };
                };
                // add info to SQL database 
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES (${answer.roleName}, ${answer.salary}, ${deptID})`, (err, res) => {
                    if (err) throw err;
                    console.log("Role added!");
                    init();
                });
            });
        });
};
function addDept() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter department name:",
            name: "deptName"
        }
    ]).then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES (${answer.deptName})`, (err, res) => {
            if (err) throw err;
            console.log(`Department "${answer.deptName}" added!`);
            init();
        });
    });
};
function viewAllDepts() {
    connection.query(`SELECT name AS "Departments" FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};
function viewAllRoles() {
    connection.query(`SELECT title AS "Roles", department.name AS Department, salary AS "Curr Salary" FROM role JOIN department ON role.department_id = department.id ORDER BY department.name`, (err, res) => {
        if (err) throw err;
        console.table(res);
        endChoice();
    })
};
function viewAllEmp() {
    
};
function viewRolesByDept() {
    
};
function viewEmpByMgr() {
    
};
function viewBudget() {
    
};
function updateMgr() {
    
};
function updateEmpRole() {
    
};
function deleteEmp() {
    
};
function deleteRole() {
    
};
function deleteDept() {
    
};
