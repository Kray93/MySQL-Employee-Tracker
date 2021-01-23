USE employees_db;

INSERT INTO department (name)
VALUES 
("Sales"),
("Service"),
("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
("Sales Manager", 75000, 1),
("Sales Associate", 52750, 1),
("Service Manager", 63490, 2),
("Service Advisor", 32365, 2),
("Service Tech", 47285, 2),
("Finance Manager", 66140, 3),
("Financer", 44455, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Kevin", "Smith", 1, 1),
("Kelvin", "Smith", 3, 2),
("Kevan", "Smith", 6, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES 
("Klaven", "Smith", 2),
("Keevan", "Smith", 2),
("Keenan", "Smith", 4),
("Kaden", "Smith", 4),
("Karden", "Smith", 5),
("Kalvin", "Smith", 5),
("Kanan", "Smith", 7);