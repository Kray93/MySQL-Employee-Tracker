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
                break;
            case "VIEW all departments, roles, roles by department, all employees, employees by manager or department buggets":
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
                break;
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
                break;
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
                break;
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
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.first_name}", "${answer.last_name}", "${roleID}", "${managerID}")`, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added!");
                        init();
                    });
                } else {
                    connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answer.first_name}", "${answer.last_name}", "${roleID}")`, (err, res) => {
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
                let deptID;
                for (i in deptArr) {
                    if (deptArr[i].name === answer.deptName) {
                        deptID = deptArr[i].id;
                    };
                };
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleName}", "${answer.salary}", "${deptID}")`, (err, res) => {
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
        connection.query(`INSERT INTO department (name) VALUE ("${answer.deptName}")`, (err, res) => {
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
        init();
    })
};
function viewAllEmp() {
    connection.query(`SELECT employee.id, first_name, last_name, salary, manager_id, department.name, role.title FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;`, (err, res) => {
        if (err) throw err;
        const allEmp = [];
        for (i in res) {
            const newView = {};
            newView.Name = `${res[i].first_name} ${res[i].last_name}`;
            newView.Role = res[i].title;
            newView.Department = res[i].name;
            newView.Salary = `$${res[i].salary} / Year`;
            for (j in res) {
                if (res[i].manager_id === res[j].id) {
                    newView.Manager = `${res[j].first_name} ${res[j].last_name}`;
                };
            };
            allEmp.push(newView);
        };
        console.table(allEmp);
        init();
    });
};
function viewRolesByDept() {
    connection.query("SELECT id, name FROM department;", (err, res) => {
        const deptNames = [];
        for (i in res) {
            deptNames.push(res[i].name);
        }
        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to view Roles",
                choices: deptNames,
                name: "deptName"
            }
        ]).then((answer) => {
                let deptID;
                for (j in res) {
                    if (answer.deptName === res[j].name) {
                        deptID = res[j].id;
                    };
                };
                connection.query(`SELECT title, salary FROM role WHERE department_id = "${deptID}"`, (err, data) => {
                    console.table(data);
                    init();
                });
            });
    });
};
function viewEmpByMgr() {
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, data) => {
        if (err) throw err;
        const managerList = [];
        for (i in data) {
            for (j in data) {
                if (data[j].manager_id === data[i].id) {
                    managerList.push(`${data[i].first_name} ${data[i].last_name}`);
                };
            };
        };
        inquirer.prompt([
            {
                type: "list",
                message: "Select Manager to view Employees",
                choices: managerList,
                name: "managerChoice"
            }
        ]).then((answer) => {
                let managerID;
                for (k in empData) {
                    if (answer.managerChoice === `${empData[k].first_name} ${empData[k].last_name}`) {
                        managerID = data[k].id;
                    };
                };
                connection.query(`SELECT first_name AS "First Name", last_name AS "Last Name", title AS "Role", department.name AS "Department", salary AS "Salary" FROM employee JOIN role ON role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.manager_id = "${managerID}"`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    init();
                });
            });
    });
};
function viewBudget() {
    const newquery = `SELECT COUNT(role_id) AS role_count, role.title, role.salary, department.name FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id GROUP BY role_id; `
    connection.query(newquery, (err, res) => {
        if(err) throw err;
        const totalBudget = [];
        const deptList = [];
        for (i in res) {
            const newBudgetObj = {};
            newBudgetObj.role = res[i].title;
            newBudgetObj.total_cost = res[i].salary * res[i].role_count;
            newBudgetObj.dept = res[i].name;
            totalBudget.push(newBudgetObj);
            deptList.push(res[i].name); 
        };
        const newDeptList = [... new Set(deptList)];
        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to view Utilized Budget",
                choices: newDeptList,
                name: "deptChoice"
            }
        ]).then((answer) => {
                let totalBudget = 0;
                for (j in totalBudget) {
                    if (totalBudget[j].dept === answer.deptChoice) {
                        totalBudget += totalBudget[j].total_cost;
                    };
                };
                console.table([{ Department: answer.deptChoice, Budget: `$${totalBudget}` }]);
                init();
            });
    });
};
function updateMgr() {
    const nameArr = [];
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, res) => {
        if (err) throw err;
        for (i in res) {
            nameArr.push(`${res[i].first_name} ${res[i].last_name}`);
        };
        inquirer.prompt([
            {
                type: "list",
                message: "Select Employee to Update:",
                choices: nameArr,
                name: "empSelection"
            },
            {
                type: "list",
                message: `Select New Manager for this Employee`,
                choices: nameArr,
                name: "newManager"
            }
        ]).then((answer) => {
                let managerID;
                for (i in res) {
                    if (`${res[i].first_name} ${res[i].last_name}` === answer.newManager) {
                        managerID = res[i].id;
                    };
                };
                if (answer.empSelection === answer.newManager) {
                    console.log("Employee and manager cannot be the same!\nPlease Try Again...");
                    updateMgr();
                } else {
                    connection.query(`UPDATE employee SET manager_id = "${managerID}" WHERE CONCAT(first_name, " ", last_name) = "${answer.empSelection}"`, (err, res) => {
                        if (err) throw err;
                        console.log("Employee's manager updated.");
                        init();
                    });
                };
            });
    });
};
function updateEmpRole() {
     const namesArr = [];
     let empArr;
     const titlesArr = [];
     let roleArr;
     connection.query("SELECT id, title FROM role", (err, roleData) => {
         if (err) throw err;
         for (j in roleData) {
             titlesArr.push(roleData[j].title)
         };
         connection.query("SELECT id, first_name, last_name FROM employee", (err, empData) => {
             if (err) throw err;
             for (i in empData) {
                 empArr = empData;
                 const fullName = `${empData[i].first_name} ${empData[i].last_name}`;
                 namesArr.push(fullName);
                 roleArr = empData;
             };
             inquirer.prompt([
                 {
                     type: "list",
                     message: "Whose role do you want to change?",
                     choices: namesArr,
                     name: "empSelection"
                 },
                 {
                     type: "list",
                     message: "What is this employees new role?",
                     choices: titlesArr,
                     name: "newRole"
                 }
             ]).then((answer) => {
                     let roleID;
                     for (i in roleData) {
                         if (roleData[i].title === answer.newRole) {
                             roleID = roleData[i].id;
                         };
                     };
                     console.log("new role id: " + roleID);
                     connection.query(`UPDATE employee SET role_id = "${roleID}" WHERE CONCAT(first_name, " ", last_name) = "${answer.empSelection}"`, (err, res) => {
                         if (err) throw err;
                         console.log("Employee roll updated");
                         init();
                     });
                 });
 
         });
     });
};
function deleteEmp() {
    const empList = [];
    const mgrList = [];
    connection.query("SELECT id, first_name, last_name, manager_id FROM employee", (err, empData) => {
        if (err) throw err;
        for (i in empData) {
            empList.push(`${empData[i].first_name} ${empData[i].last_name}`);
        };
        for (k in empData) {
            for (j in empData) {
                if (empData[j].manager_id === empData[k].id) {
                    mgrList.push(`${empData[k].first_name} ${empData[k].last_name}`);
                };
            };
        };
        inquirer.prompt([
            {
                type: "list",
                message: "Select employee to delete (Managers cannot be deleted).",
                choices: empList,
                name: "empSelection"
            }
        ]).then((answer) => {
                if(mgrList.includes(answer.empSelection)){
                    console.log(`\n"${answer.empSelection}" is a Manager and cannot be deleted\nNOTE: To delete a manager, all employees under that manager must be reassigned\n(Select 'Update Employee Manager' on Main Menu\n\n`);
                    init();
                } else {
                    let empID;
                    for (l in empData){
                        if (answer.empSelection === `${empData[l].first_name} ${empData[l].last_name}`){
                            empID = empData[l].id;
                        };
                    };
                    connection.query(`DELETE FROM employee WHERE id = "${empID}"`, (err, res) => {
                        if (err) throw err;
                        console.log("Employee deleted.")
                        init();
                    });
                };
            });
    });
};
function deleteRole() {
    connection.query(`SELECT title, COUNT(employee.id) AS count FROM role LEFT JOIN employee ON role.id = employee.role_id GROUP BY employee.id;`, (err, data) => {
        if (err) throw err;
        console.table(data);
        const titlesArr = [];
        const rolesArr = [];
        for (i in data){
            titlesArr.push(`${data[i].title}`);
            if(data[i].count !== 0){
                rolesArr.push(data[i].title);
            };
        };
        inquirer.prompt([
            {
                type: "list",
                message: "Select Role to Delete. Filled roles cannot be deleted!",
                choices: titlesArr,
                name: "roleSelection"
            }
        ]).then((answer) => {
            if(rolesArr.includes(answer.roleSelection)){
                console.log(`\n\nThe role of "${answer.roleSelection}" is filled and cannot be deleted!\nNOTE: To delete a role All employees in that role must be reassigned\nSelect "Update Employee Role" on Main Menu\n`);
                init();
            } else {
                connection.query(`DELETE FROM role WHERE title = "${answer.roleSelection}"`, (err, res) => {
                    if (err) throw err;
                    console.log("Role deleted.");
                    init();
                });
            };
        });
    });
};
function deleteDept() {
    const deptArr = [];
    const fullDept = [];
    connection.query(`SELECT name, COUNT(role.id) AS count FROM department LEFT JOIN role ON department_id = department.id GROUP BY name`, (err, data) => {
        for(i in data){
            deptArr.push(data[i].name);
            if(data[i].count !== 0){
                fullDept.push(data[i].name);
            };
        };
        inquirer.prompt([
            {
                type: "list",
                message: "Select Department to Delete. Filled Departments cannot be Deleted!",
                choices: deptArr,
                name: "deptSelection"
            }
        ]).then((answer) => {
            if(fullDept.includes(answer.deptSelection)){
                console.log(`\nThe "${answer.deptSelection}" department has listed Roles on file and cannot be deleted!\nNOTE: To delete a department, first delete all roles in that department\n(Select 'Delete Role' in Main Menu)\n`);
                init();
            } else {
                connection.query(`DELETE FROM department WHERE name = "${answer.deptSelection}"`, (err, res) => {
                    if (err) throw err;
                    console.log("Department deleted.");
                    init();
                });
            };
        });
    });

};
