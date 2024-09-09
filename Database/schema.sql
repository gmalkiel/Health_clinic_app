CREATE DATABASE health_clinic;
USE health_clinic;

CREATE TABLE Patients (
    PatientID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Age INTEGER NOT NULL,
    IDNumber VARCHAR(20) NOT NULL,
    MaritalStatus VARCHAR(50),
    TreatmentGoals TEXT,
    SiblingPosition INTEGER,
    SiblingsNumber INTEGER,
    EducationalInstitution VARCHAR(255),
    Diagnoses TEXT,
    RiskLevel VARCHAR(50),
    Medication TEXT,
    ReferralSource VARCHAR(255),
    RemainingSessions INTEGER,
    RemainingPayment DECIMAL(10, 2),
    AppointmentTime VARCHAR(255)
);
CREATE TABLE Appointments (
    AppointmentID INTEGER PRIMARY KEY AUTO_INCREMENT,
    TherapistID INTEGER NOT NULL,
    PatientID INTEGER NOT NULL,
    AppointmentsDay VARCHAR(10) NOT NULL,
    AppointmentsTime TIME NOT NULL,
    Location VARCHAR(255),
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
    ON DELETE CASCADE
);


CREATE TABLE Sessions (
    SessionID INTEGER PRIMARY KEY AUTO_INCREMENT,
    PatientID INTEGER,
    SessionDate DATETIME NOT NULL,
    SessionContent TEXT NOT NULL,
    SessionSummary TEXT,
    ArtworkImage BLOB,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
    ON DELETE CASCADE
);

CREATE TABLE TherapistPatients (
    TherapistID INTEGER NOT NULL,
    PatientID INTEGER NOT NULL,
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID) ON DELETE CASCADE,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE CASCADE,
    PRIMARY KEY (TherapistID, PatientID)
);


/*
CREATE TABLE Patients (
    PatientID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Age INTEGER NOT NULL,
    MaritalStatus VARCHAR(50),
    TreatmentGoals TEXT,
    SiblingPosition INTEGER,
    EducationalInstitution VARCHAR(255),
    Diagnoses TEXT,
    RiskLevel VARCHAR(50),
    Medication TEXT,
    ReferralSource VARCHAR(255),
    RemainingSessions INTEGER,
    RemainingPayment DECIMAL(10, 2),
    AppointmentDateTime DATETIME
);
CREATE TABLE Sessions (
    SessionID INTEGER PRIMARY KEY AUTO_INCREMENT,
    PatientID INTEGER,
    SessionDate DATETIME NOT NULL,
    SessionContent TEXT NOT NULL,
    SessionSummary TEXT,
    ArtworkImage BLOB,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);
CREATE TABLE Therapists (
    TherapistID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    IDNumber VARCHAR(20) NOT NULL,
    DateOfBirth DATE,
    Email VARCHAR(255),
    UserName VARCHAR(255),
    T_Password VARCHAR(255),
    Phone VARCHAR(20)
);
CREATE TABLE Appointments (
    AppointmentID INTEGER PRIMARY KEY AUTO_INCREMENT,
    TherapistID INTEGER NOT NULL,
    PatientID INTEGER NOT NULL,
    StartDateTime DATETIME NOT NULL,
    EndDateTime DATETIME NOT NULL,
    Location VARCHAR(255),
    Notes TEXT,
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);
CREATE TABLE Forms (
    FormID INTEGER PRIMARY KEY AUTO_INCREMENT,
    PatientID INTEGER,
    FormType VARCHAR(255) NOT NULL,
    FormContent TEXT,
    UploadDocument BLOB,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID)
);
CREATE TABLE Managers (
    ManagerID INTEGER PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    IDNumber VARCHAR(20) NOT NULL
);
CREATE TABLE TherapistPatients (
    TherapistID INTEGER NOT NULL,
    PatientID INTEGER NOT NULL,
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    PRIMARY KEY (TherapistID, PatientID)
);
*/


-- Data Insert

-- Insert Manager
INSERT INTO Managers (Name, IDNumber) VALUES ('Manager 1', 'M001');

-- Insert Therapists
    
INSERT INTO Therapists (Name, IDNumber, DateOfBirth, Email,UserName,T_Password, Phone) VALUES
('moshe', 'T001', '1980-01-01', 'therapist1@example.com','moshe','1589', '123-456-7890'),
('chaym', 'T002', '1982-02-02', 'therapist2@example.com','chaym','1234', '123-456-7891'),
('michal', 'T003', '1984-03-03', 'therapist3@example.com','michal','1756', '123-456-7892'),
('Therapist 4', 'T004', '1986-04-04', 'therapist4@example.com','avi','1589', '123-456-7893'),
('Therapist 5', 'T005', '1988-05-05', 'therapist5@example.com','avi','1589', '123-456-7894'),
('Therapist 6', 'T006', '1990-06-06', 'therapist6@example.com','avi','1589', '123-456-7895'),
('Therapist 7', 'T007', '1992-07-07', 'therapist7@example.com','avi','1589', '123-456-7896');

INSERT INTO Patients (Name, Age, IDNumber, MaritalStatus, TreatmentGoals, SiblingPosition, SiblingsNumber, EducationalInstitution, Diagnoses, RiskLevel, Medication, ReferralSource, RemainingSessions, RemainingPayment, AppointmentTime) VALUES
-- מטופלים למטפל 1
('Patient 1', 30, 'P001', 'Single', 'Goal 1', 1, 3, 'School A', 'Diagnosis A', 'Low', 'Med A', 'Referral A', 5, 200.00, 'Monday 17:00'),
('Patient 2', 35, 'P002', 'Married', 'Goal 2', 2, 2, 'School B', 'Diagnosis B', 'Medium', 'Med B', 'Referral B', 10, 150.00, 'Tuesday 18:00'),
('Patient 3', 40, 'P003', 'Single', 'Goal 3', 3, 4, 'School C', 'Diagnosis C', 'High', 'Med C', 'Referral C', 8, 250.00, 'Wednesday 16:00'),
-- מטופלים למטפל 2
('Patient 4', 45, 'P004', 'Single', 'Goal 4', 1, 1, 'School D', 'Diagnosis D', 'Low', 'Med D', 'Referral D', 6, 300.00, 'Thursday 09:00'),
('Patient 5', 50, 'P005', 'Married', 'Goal 5', 2, 2, 'School E', 'Diagnosis E', 'Medium', 'Med E', 'Referral E', 7, 350.00, 'Friday 10:00'),
('Patient 6', 55, 'P006', 'Widowed', 'Goal 6', 3, 3, 'School F', 'Diagnosis F', 'High', 'Med F', 'Referral F', 4, 400.00, 'Saturday 11:00'),
-- מטופלים למטפל 3
('Patient 7', 60, 'P007', 'Single', 'Goal 7', 1, 4, 'School G', 'Diagnosis G', 'Low', 'Med G', 'Referral G', 5, 250.00, 'Monday 14:00'),
('Patient 8', 65, 'P008', 'Married', 'Goal 8', 2, 5, 'School H', 'Diagnosis H', 'Medium', 'Med H', 'Referral H', 6, 300.00, 'Tuesday 15:00'),
('Patient 9', 70, 'P009', 'Widowed', 'Goal 9', 3, 6, 'School I', 'Diagnosis I', 'High', 'Med I', 'Referral I', 7, 350.00, 'Wednesday 16:00'),
-- מטופלים למטפל 4
('Patient 10', 32, 'P010', 'Single', 'Goal 10', 1, 2, 'School J', 'Diagnosis J', 'Low', 'Med J', 'Referral J', 4, 500.00, 'Sunday 09:00'),
('Patient 11', 28, 'P011', 'Married', 'Goal 11', 2, 3, 'School K', 'Diagnosis K', 'Medium', 'Med K', 'Referral K', 5, 600.00, 'Monday 10:00'),
('Patient 12', 36, 'P012', 'Divorced', 'Goal 12', 3, 4, 'School L', 'Diagnosis L', 'High', 'Med L', 'Referral L', 6, 700.00, 'Tuesday 11:00'),
-- מטופלים למטפל 5
('Patient 13', 38, 'P013', 'Single', 'Goal 13', 1, 2, 'School M', 'Diagnosis M', 'Low', 'Med M', 'Referral M', 7, 800.00, 'Wednesday 12:00'),
('Patient 14', 29, 'P014', 'Married', 'Goal 14', 2, 3, 'School N', 'Diagnosis N', 'Medium', 'Med N', 'Referral N', 8, 900.00, 'Thursday 13:00'),
('Patient 15', 40, 'P015', 'Widowed', 'Goal 15', 3, 4, 'School O', 'Diagnosis O', 'High', 'Med O', 'Referral O', 9, 1000.00, 'Friday 14:00'),
-- מטופלים למטפל 6
('Patient 16', 45, 'P016', 'Single', 'Goal 16', 1, 2, 'School P', 'Diagnosis P', 'Low', 'Med P', 'Referral P', 10, 1100.00, 'Saturday 15:00'),
('Patient 17', 34, 'P017', 'Married', 'Goal 17', 2, 3, 'School Q', 'Diagnosis Q', 'Medium', 'Med Q', 'Referral Q', 11, 1200.00, 'Sunday 16:00'),
('Patient 18', 27, 'P018', 'Divorced', 'Goal 18', 3, 4, 'School R', 'Diagnosis R', 'High', 'Med R', 'Referral R', 12, 1300.00, 'Monday 17:00'),
-- מטופלים למטפל 7
('Patient 19', 33, 'P019', 'Single', 'Goal 19', 1, 2, 'School S', 'Diagnosis S', 'Low', 'Med S', 'Referral S', 13, 1400.00, 'Tuesday 18:00'),
('Patient 20', 31, 'P020', 'Married', 'Goal 20', 2, 3, 'School T', 'Diagnosis T', 'Medium', 'Med T', 'Referral T', 14, 1500.00, 'Wednesday 19:00'),
('Patient 21', 39, 'P021', 'Widowed', 'Goal 21', 3, 4, 'School U', 'Diagnosis U', 'High', 'Med U', 'Referral U', 15, 1600.00, 'Thursday 20:00');



INSERT INTO Appointments (TherapistID, PatientID, AppointmentsDay, AppointmentsTime, Location) VALUES
-- Appointments עבור המטפל 1
(1, 1, 'Sunday', '17:00', 'Room 1'),
(1, 2, 'Monday', '17:00', 'Room 2'),
(1, 3, 'Wednesday', '16:00', 'Room 3'),
-- Appointments עבור המטפל 2
(2, 4, 'Thursday', '09:00', 'Room 1'),
(2, 5, 'Friday', '10:00', 'Room 2'),
(2, 6, 'Saturday', '11:00', 'Room 3'),
-- Appointments עבור המטפל 3
(3, 7, 'Monday', '14:00', 'Room 1'),
(3, 8, 'Tuesday', '15:00', 'Room 2'),
(3, 9, 'Wednesday', '16:00', 'Room 3'),
-- Appointments עבור המטפל 4
(4, 10, 'Sunday', '09:00', 'Room 4'),
(4, 11, 'Monday', '10:00', 'Room 5'),
(4, 12, 'Tuesday', '11:00', 'Room 6'),
-- Appointments עבור המטפל 5
(5, 13, 'Wednesday', '12:00', 'Room 4'),
(5, 14, 'Thursday', '13:00', 'Room 5'),
(5, 15, 'Friday', '14:00', 'Room 6'),
-- Appointments עבור המטפל 6
(6, 16, 'Saturday', '15:00', 'Room 4'),
(6, 17, 'Sunday', '16:00', 'Room 5'),
(6, 18, 'Monday', '17:00', 'Room 6'),
-- Appointments עבור המטפל 7
(7, 19, 'Tuesday', '18:00', 'Room 4'),
(7, 20, 'Wednesday', '19:00', 'Room 5'),
(7, 21, 'Thursday', '20:00', 'Room 6');

INSERT INTO Sessions (PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImage) VALUES
-- Sessions עבור המטופלים של המטפל 1
(1, '2024-09-01 17:00:00', 'Session Content 1', 'Session Summary 1', NULL),
(1, '2024-09-08 17:00:00', 'Session Content 2', 'Session Summary 2', NULL),
(2, '2024-09-02 18:00:00', 'Session Content 3', 'Session Summary 3', NULL),
(2, '2024-09-09 18:00:00', 'Session Content 4', 'Session Summary 4', NULL),
(3, '2024-09-03 16:00:00', 'Session Content 5', 'Session Summary 5', NULL),
(3, '2024-09-10 16:00:00', 'Session Content 6', 'Session Summary 6', NULL),
-- Sessions עבור המטופלים של המטפל 2
(4, '2024-09-04 09:00:00', 'Session Content 7', 'Session Summary 7', NULL),
(4, '2024-09-11 09:00:00', 'Session Content 8', 'Session Summary 8', NULL),
(5, '2024-09-05 10:00:00', 'Session Content 9', 'Session Summary 9', NULL),
(5, '2024-09-12 10:00:00', 'Session Content 10', 'Session Summary 10', NULL),
(6, '2024-09-06 11:00:00', 'Session Content 11', 'Session Summary 11', NULL),
(6, '2024-09-13 11:00:00', 'Session Content 12', 'Session Summary 12', NULL),
-- Sessions עבור המטופלים של המטפל 3
(7, '2024-09-07 14:00:00', 'Session Content 13', 'Session Summary 13', NULL),
(7, '2024-09-14 14:00:00', 'Session Content 14', 'Session Summary 14', NULL),
(8, '2024-09-08 15:00:00', 'Session Content 15', 'Session Summary 15', NULL),
(8, '2024-09-15 15:00:00', 'Session Content 16', 'Session Summary 16', NULL),
(9, '2024-09-09 16:00:00', 'Session Content 17', 'Session Summary 17', NULL),
(9, '2024-09-16 16:00:00', 'Session Content 18', 'Session Summary 18', NULL),
-- Sessions עבור המטופלים של המטפל 4
(10, '2024-09-01 09:00:00', 'Session Content 19', 'Session Summary 19', NULL),
(10, '2024-09-08 09:00:00', 'Session Content 20', 'Session Summary 20', NULL),
(11, '2024-09-02 10:00:00', 'Session Content 21', 'Session Summary 21', NULL),
(11, '2024-09-09 10:00:00', 'Session Content 22', 'Session Summary 22', NULL),
(12, '2024-09-03 11:00:00', 'Session Content 23', 'Session Summary 23', NULL),
(12, '2024-09-10 11:00:00', 'Session Content 24', 'Session Summary 24', NULL),
-- Sessions עבור המטופלים של המטפל 5
(13, '2024-09-04 12:00:00', 'Session Content 25', 'Session Summary 25', NULL),
(13, '2024-09-11 12:00:00', 'Session Content 26', 'Session Summary 26', NULL),
(14, '2024-09-05 13:00:00', 'Session Content 27', 'Session Summary 27', NULL),
(14, '2024-09-12 13:00:00', 'Session Content 28', 'Session Summary 28', NULL),
(15, '2024-09-06 14:00:00', 'Session Content 29', 'Session Summary 29', NULL),
(15, '2024-09-13 14:00:00', 'Session Content 30', 'Session Summary 30', NULL),
-- Sessions עבור המטופלים של המטפל 6
(16, '2024-09-07 15:00:00', 'Session Content 31', 'Session Summary 31', NULL),
(16, '2024-09-14 15:00:00', 'Session Content 32', 'Session Summary 32', NULL),
(17, '2024-09-08 16:00:00', 'Session Content 33', 'Session Summary 33', NULL),
(17, '2024-09-15 16:00:00', 'Session Content 34', 'Session Summary 34', NULL),
(18, '2024-09-09 17:00:00', 'Session Content 35', 'Session Summary 35', NULL),
(18, '2024-09-16 17:00:00', 'Session Content 36', 'Session Summary 36', NULL),
-- Sessions עבור המטופלים של המטפל 7
(19, '2024-09-10 18:00:00', 'Session Content 37', 'Session Summary 37', NULL),
(19, '2024-09-17 18:00:00', 'Session Content 38', 'Session Summary 38', NULL),
(20, '2024-09-11 19:00:00', 'Session Content 39', 'Session Summary 39', NULL),
(20, '2024-09-18 19:00:00', 'Session Content 40', 'Session Summary 40', NULL),
(21, '2024-09-12 20:00:00', 'Session Content 41', 'Session Summary 41', NULL),
(21, '2024-09-19 20:00:00', 'Session Content 42', 'Session Summary 42', NULL);


-- Insert Therapist-Patient Relations
INSERT INTO TherapistPatients (TherapistID, PatientID) VALUES
-- Therapist 1's Patients
(1, 1), (1, 2), (1, 3),
-- Therapist 2's Patients
(2, 4), (2, 5), (2, 6),
-- Therapist 3's Patients
(3, 7), (3, 8), (3, 9),
-- Therapist 4's Patients
(4, 10), (4, 11), (4, 12),
-- Therapist 5's Patients
(5, 13), (5, 14), (5, 15),
-- Therapist 6's Patients
(6, 16), (6, 17), (6, 18),
-- Therapist 7's Patients
(7, 19), (7, 20), (7, 21);


/*
-- Insert Sessions
INSERT INTO Sessions (PatientID, SessionDate, SessionContent, SessionSummary, ArtworkImage) VALUES
-- Sessions for Patient 1
(1, '2024-08-20', 'Session content for Patient 1', 'Session summary for Patient 1', NULL),
(1, '2024-08-27', 'Session content for Patient 1', 'Session summary for Patient 1', NULL),
-- Sessions for Patient 2
(2, '2024-08-21', 'Session content for Patient 2', 'Session summary for Patient 2', NULL),
(2, '2024-08-28', 'Session content for Patient 2', 'Session summary for Patient 2', NULL),
-- Sessions for Patient 3
(3, '2024-08-22', 'Session content for Patient 3', 'Session summary for Patient 3', NULL),
(3, '2024-08-29', 'Session content for Patient 3', 'Session summary for Patient 3', NULL),
-- Repeat similar entries for other patients as needed
-- Sessions for Patient 4
(4, '2024-08-23', 'Session content for Patient 4', 'Session summary for Patient 4', NULL),
(4, '2024-08-30', 'Session content for Patient 4', 'Session summary for Patient 4', NULL),
-- Sessions for Patient 5
(5, '2024-08-24', 'Session content for Patient 5', 'Session summary for Patient 5', NULL),
(5, '2024-08-31', 'Session content for Patient 5', 'Session summary for Patient 5', NULL),
-- Sessions for Patient 6
(6, '2024-08-25', 'Session content for Patient 6', 'Session summary for Patient 6', NULL),
(6, '2024-08-26', 'Session content for Patient 6', 'Session summary for Patient 6', NULL);
-- Repeat similar entries for other patients as needed

-- Insert Appointments
INSERT INTO Appointments (TherapistID, PatientID, StartDateTime, EndDateTime, Location, Notes) VALUES
-- Appointments for Therapist 1
(1, 1, '2024-08-20 10:00:00', '2024-08-20 11:00:00', 'Room 101', 'Initial assessment'),
(1, 2, '2024-08-21 11:00:00', '2024-08-21 12:00:00', 'Room 102', 'Follow-up session'),
(1, 3, '2024-08-22 09:00:00', '2024-08-22 10:00:00', 'Room 103', 'Progress review'),
-- Appointments for Therapist 2
(2, 4, '2024-08-23 14:00:00', '2024-08-23 15:00:00', 'Room 201', 'Initial assessment'),
(2, 5, '2024-08-24 12:00:00', '2024-08-24 13:00:00', 'Room 202', 'Follow-up session'),
(2, 6, '2024-08-25 11:00:00', '2024-08-25 12:00:00', 'Room 203', 'Progress review'),
-- Appointments for Therapist 3
(3, 7, '2024-08-26 16:00:00', '2024-08-26 17:00:00', 'Room 301', 'Initial assessment'),
(3, 8, '2024-08-27 15:00:00', '2024-08-27 16:00:00', 'Room 302', 'Follow-up session'),
(3, 9, '2024-08-28 14:00:00', '2024-08-28 15:00:00', 'Room 303', 'Progress review'),
-- Appointments for Therapist 4
(4, 10, '2024-08-29 13:00:00', '2024-08-29 14:00:00', 'Room 401', 'Initial assessment'),
(4, 11, '2024-08-20 10:00:00', '2024-08-20 11:00:00', 'Room 402', 'Follow-up session'),
(4, 12, '2024-08-21 11:00:00', '2024-08-21 12:00:00', 'Room 403', 'Progress review'),
-- Appointments for Therapist 5
(5, 13, '2024-08-22 09:00:00', '2024-08-22 10:00:00', 'Room 501', 'Initial assessment'),
(5, 14, '2024-08-23 14:00:00', '2024-08-23 15:00:00', 'Room 502', 'Follow-up session'),
(5, 15, '2024-08-24 12:00:00', '2024-08-24 13:00:00', 'Room 503', 'Progress review'),
-- Appointments for Therapist 6
(6, 16, '2024-08-25 11:00:00', '2024-08-25 12:00:00', 'Room 601', 'Initial assessment'),
(6, 17, '2024-08-26 16:00:00', '2024-08-26 17:00:00', 'Room 602', 'Follow-up session'),
(6, 18, '2024-08-27 15:00:00', '2024-08-27 16:00:00', 'Room 603', 'Progress review'),
-- Appointments for Therapist 7
(7, 19, '2024-08-28 14:00:00', '2024-08-28 15:00:00', 'Room 701', 'Initial assessment'),
(7, 20, '2024-08-29 13:00:00', '2024-08-29 14:00:00', 'Room 702', 'Follow-up session'),
(7, 21, '2024-08-20 10:00:00', '2024-08-20 11:00:00', 'Room 703', 'Progress review');


-- Insert Patients
INSERT INTO Patients (Name, Age, MaritalStatus, TreatmentGoals, SiblingPosition, EducationalInstitution, Diagnoses, RiskLevel, Medication, ReferralSource, RemainingSessions, RemainingPayment, AppointmentDateTime) VALUES
-- Patients for Therapist 1
('Patient 1', 25, 'Single', 'Goal 1', 1, 'Institution 1', 'Diagnosis 1', 'Low', 'Medication 1', 'Referral 1', 10, 100.00, '2024-08-20 10:00:00'),
('Patient 2', 30, 'Married', 'Goal 2', 2, 'Institution 2', 'Diagnosis 2', 'Medium', 'Medication 2', 'Referral 2', 8, 150.00, '2024-08-21 11:00:00'),
('Patient 3', 35, 'Single', 'Goal 3', 3, 'Institution 3', 'Diagnosis 3', 'High', 'Medication 3', 'Referral 3', 12, 200.00, '2024-08-22 09:00:00'),
-- Patients for Therapist 2
('Patient 4', 28, 'Single', 'Goal 4', 1, 'Institution 4', 'Diagnosis 4', 'Low', 'Medication 4', 'Referral 4', 6, 175.00, '2024-08-23 14:00:00'),
('Patient 5', 32, 'Married', 'Goal 5', 2, 'Institution 5', 'Diagnosis 5', 'Medium', 'Medication 5', 'Referral 5', 15, 120.00, '2024-08-24 12:00:00'),
('Patient 6', 40, 'Single', 'Goal 6', 3, 'Institution 6', 'Diagnosis 6', 'High', 'Medication 6', 'Referral 6', 9, 80.00, '2024-08-25 11:00:00'),
-- Patients for Therapist 3
('Patient 7', 25, 'Married', 'Goal 7', 1, 'Institution 7', 'Diagnosis 7', 'Low', 'Medication 7', 'Referral 7', 10, 140.00, '2024-08-26 16:00:00'),
('Patient 8', 30, 'Single', 'Goal 8', 2, 'Institution 8', 'Diagnosis 8', 'Medium', 'Medication 8', 'Referral 8', 11, 90.00, '2024-08-27 15:00:00'),
('Patient 9', 35, 'Divorced', 'Goal 9', 3, 'Institution 9', 'Diagnosis 9', 'High', 'Medication 9', 'Referral 9', 13, 110.00, '2024-08-28 14:00:00'),
-- Patients for Therapist 4
('Patient 10', 28, 'Married', 'Goal 10', 1, 'Institution 10', 'Diagnosis 10', 'Low', 'Medication 10', 'Referral 10', 14, 130.00, '2024-08-29 13:00:00'),
('Patient 11', 32, 'Single', 'Goal 11', 2, 'Institution 11', 'Diagnosis 11', 'Medium', 'Medication 11', 'Referral 11', 10, 100.00, '2024-08-20 10:00:00'),
('Patient 12', 38, 'Married', 'Goal 12', 3, 'Institution 12', 'Diagnosis 12', 'High', 'Medication 12', 'Referral 12', 8, 150.00, '2024-08-21 11:00:00'),
-- Patients for Therapist 5
('Patient 13', 35, 'Single', 'Goal 13', 1, 'Institution 13', 'Diagnosis 13', 'Low', 'Medication 13', 'Referral 13', 6, 175.00, '2024-08-22 09:00:00'),
('Patient 14', 40, 'Married', 'Goal 14', 2, 'Institution 14', 'Diagnosis 14', 'Medium', 'Medication 14', 'Referral 14', 15, 120.00, '2024-08-23 14:00:00'),
('Patient 15', 45, 'Single', 'Goal 15', 3, 'Institution 15', 'Diagnosis 15', 'High', 'Medication 15', 'Referral 15', 9, 80.00, '2024-08-24 12:00:00'),
-- Patients for Therapist 6
('Patient 16', 30, 'Married', 'Goal 16', 1, 'Institution 16', 'Diagnosis 16', 'Low', 'Medication 16', 'Referral 16', 10, 140.00, '2024-08-25 11:00:00'),
('Patient 17', 35, 'Single', 'Goal 17', 2, 'Institution 17', 'Diagnosis 17', 'Medium', 'Medication 17', 'Referral 17', 11, 90.00, '2024-08-26 16:00:00'),
('Patient 18', 40, 'Divorced', 'Goal 18', 3, 'Institution 18', 'Diagnosis 18', 'High', 'Medication 18', 'Referral 18', 13, 110.00, '2024-08-27 15:00:00'),
-- Patients for Therapist 7
('Patient 19', 25, 'Single', 'Goal 19', 1, 'Institution 19', 'Diagnosis 19', 'Low', 'Medication 19', 'Referral 19', 14, 130.00, '2024-08-28 14:00:00'),
('Patient 20', 30, 'Married', 'Goal 20', 2, 'Institution 20', 'Diagnosis 20', 'Medium', 'Medication 20', 'Referral 20', 10, 100.00, '2024-08-29 13:00:00'),
('Patient 21', 32, 'Single', 'Goal 21', 3, 'Institution 21', 'Diagnosis 21', 'High', 'Medication 21', 'Referral 21', 6, 175.00, '2024-08-20 10:00:00');
*/