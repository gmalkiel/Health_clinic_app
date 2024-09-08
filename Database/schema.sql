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
    AppointmentsTime TIME NOT NUL
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
    FOREIGN KEY (TherapistID) REFERENCES Therapists(TherapistID),
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID),
    PRIMARY KEY (TherapistID, PatientID)
    ON DELETE CASCADE
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
