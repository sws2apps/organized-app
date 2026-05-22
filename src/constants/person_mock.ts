type PersonRow = ['male' | 'female', string, string, string, string, string, string];

const rawData: PersonRow[] = [
  // [gender, firstName, lastName, birthDate, address, email, phone]
  // ─── Rakoto Family ──────────────────────────
    ['male', 'Hery', 'Rakoto', '1975-03-15', '626 Main Street Phoenix', 'hery.rakoto@example.com', '+81 965-431-3024'],
    ['female', 'Voahirana', 'Rakoto', '1978-05-30', '626 Main Street Phoenix', 'voahirana.rakoto@example.com', '+81 965-431-3025'],
    ['male', 'Tahina', 'Rakoto', '2001-02-12', '626 Main Street Phoenix', 'tahina.rakoto@example.com', '+81 965-431-3026'],
  // ─── Moretti Family ──────────────────────────
    ['male', 'Marco', 'Moretti', '1979-08-10', '385 Fifth Street Houston', 'marco.moretti@example.com', '+49 258-627-6644'],
    ['female', 'Chiara', 'Moretti', '1982-06-08', '385 Fifth Street Houston', 'chiara.moretti@example.com', '+44 373-953-5028'],
  // ─── Kovalenko Family ─────────────────────
    ['male', 'Oleksiy', 'Kovalenko', '1974-11-06', '1642 Ninth Street Washington', 'oleksiy.kovalenko@example.com', '+81 210-652-2785'],
    ['female', 'Daryna', 'Kovalenko', '1977-05-04', '1642 Ninth Street Washington', 'daryna.kovalenko@example.com', '+49 614-958-9364'],
    ['female', 'Ivanna', 'Kovalenko', '2000-04-20', '1642 Ninth Street Washington', 'ivanna.kovalenko@example.com', '+49 614-958-9365'],
  // ─── Silva Family ─────────────────────────
    ['male', 'Thiago', 'Silva', '1978-06-06', '576 Fifth Street Denver', 'thiago.silva@example.com', '+92 870-217-6201'],
    ['female', 'Camila', 'Silva', '1981-08-04', '576 Fifth Street Denver', 'camila.silva@example.com', '+49 989-461-8403'],
    ['male', 'Rafael', 'Silva', '2003-03-10', '576 Fifth Street Denver', 'rafael.silva@example.com', '+49 989-461-8404'],
  // ─── Ferreira Family ─────────────────────
    ['male', 'Diogo', 'Ferreira', '1980-06-13', '607 Fourth Street Jacksonville', 'diogo.ferreira@example.com', '+91 759-776-1614'],
    ['female', 'Ines', 'Ferreira', '1983-10-20', '607 Fourth Street Jacksonville', 'ines.ferreira@example.com', '+61 260-824-4986'],
  // ─── Hernandez Family ───────────────────────
    ['male', 'Alejandro', 'Hernandez', '1976-02-12', '466 Pine Street San Antonio', 'alejandro.hernandez@example.com', '+92 933-608-5083'],
    ['female', 'Valentina', 'Hernandez', '1979-06-10', '466 Pine Street San Antonio', 'valentina.hernandez@example.com', '+49 770-658-4885'],
    ['male', 'Santiago', 'Hernandez', '2002-08-25', '466 Pine Street San Antonio', 'santiago.hernandez@example.com', '+61 731-431-3457'],
  // ─── Reyes Family ──────────────────────────
    ['male', 'Carlo', 'Reyes', '1977-10-26', '1197 First Street Fort Worth', 'carlo.reyes@example.com', '+1 458-853-7877'],
    ['female', 'Althea', 'Reyes', '1980-08-25', '1197 First Street Fort Worth', 'althea.reyes@example.com', '+81 507-434-8733'],
    ['female', 'Maria', 'Reyes', '2001-11-30', '1197 First Street Fort Worth', 'maria.reyes@example.com', '+81 507-434-8734'],
  // ─── Braun Family ────────────────────────────
    ['male', 'Tobias', 'Braun', '1975-03-07', '1873 Main Street New York', 'tobias.braun@example.com', '+44 468-628-6686'],
    ['female', 'Katrin', 'Braun', '1978-09-05', '1873 Main Street New York', 'katrin.braun@example.com', '+81 259-957-5711'],
  // ─── Johnson Family #1 ─────────────
    ['male', 'Robert', 'Johnson', '1972-04-19', '1814 Cedar Street Charlotte', 'robert.johnson@example.com', '+91 936-400-4116'],
    ['female', 'Emily', 'Johnson', '1975-06-20', '1814 Cedar Street Charlotte', 'emily.johnson@example.com', '+1 450-865-6061'],
  // ─── Johnson Family #2 ───────────────
    ['male', 'Ethan', 'Johnson', '1996-01-12', '108 Adams Street Columbus', 'ethan.johnson@example.com', '+49 680-666-9673'],
    ['female', 'Sophia', 'Johnson', '1998-03-03', '108 Adams Street Columbus', 'sophia.johnson@example.com', '+92 518-863-2863'],
  // ─── Williams Family ───────────────────────
    ['male', 'Michael', 'Williams', '1978-09-11', '1386 Third Street Los Angeles', 'michael.williams@example.com', '+81 367-320-4960'],
    ['female', 'Charlotte', 'Williams', '1980-06-05', '1386 Third Street Los Angeles', 'charlotte.williams@example.com', '+49 393-605-6968'],
    ['male', 'Noah', 'Williams', '2002-02-08', '1386 Third Street Los Angeles', 'noah.williams@example.com', '+1 986-988-5297'],
  // ─── Wilson Family ─────────────────────────
    ['male', 'Jackson', 'Wilson', '1975-01-03', '568 Tenth Street San Francisco', 'jackson.wilson@example.com', '+1 514-384-3300'],
    ['female', 'Madison', 'Wilson', '1978-05-09', '568 Tenth Street San Francisco', 'madison.wilson@example.com', '+1 599-432-3048'],
    ['male', 'Carter', 'Wilson', '2001-05-01', '568 Tenth Street San Francisco', 'carter.wilson@example.com', '+81 405-412-4250'],
  // ─── Taylor Family ─────────────────────────
    ['male', 'Logan', 'Taylor', '1983-08-05', '1110 Fifth Street Chicago', 'logan.taylor@example.com', '+1 750-526-9455'],
    ['female', 'Ava', 'Taylor', '1985-06-16', '1110 Fifth Street Chicago', 'ava.taylor@example.com', '+92 802-452-4192'],
  // ─── Adams Family ──────────────────────────
    ['male', 'Gabriel', 'Adams', '1977-09-01', '1468 Eighth Street Los Angeles', 'gabriel.adams@example.com', '+91 697-236-1544'],
    ['female', 'Ella', 'Adams', '1980-06-16', '1468 Eighth Street Los Angeles', 'ella.adams@example.com', '+92 802-452-4193'],
  // ─── Kelly Family ──────────────────────────
    ['male', 'Lincoln', 'Kelly', '1976-01-12', '1110 Fifth Street Chicago', 'lincoln.kelly@example.com', '+49 680-666-9674'],
    ['female', 'Harper', 'Kelly', '1979-03-03', '1110 Fifth Street Chicago', 'harper.kelly@example.com', '+92 518-863-2864'],
  // ─── Singles 1 ────────────────────────────
    ['female', 'Mialy', 'Andriamahefa', '1995-10-13', '1170 Lincoln Street San Diego', 'mialy.andriamahefa@example.com', '+1 623-880-6871'],
    ['male', 'Faniry', 'Razafindrakoto', '1990-10-11', '996 Oak Street Chicago', 'faniry.razafindrakoto@example.com', '+91 228-363-7806'],
    ['female', 'Alessia', 'Conti', '1997-10-22', '1701 Eighth Street Columbus', 'alessia.conti@example.com', '+44 468-357-7872'],
    ['male', 'Luca', 'Ferretti', '1991-04-21', '401 Fourth Street Dallas', 'luca.ferretti@example.com', '+92 468-541-7133'],
    ['male', 'Bohdan', 'Tkachenko', '1993-06-02', '1578 Fourth Street Columbus', 'bohdan.tkachenko@example.com', '+1 341-597-6694'],
    ['female', 'Yaroslava', 'Bondarenko', '1996-02-05', '1065 Lincoln Street Dallas', 'yaroslava.bondarenko@example.com', '+61 708-508-4638'],
    ['female', 'Larissa', 'Oliveira', '1994-12-25', '1163 Pine Street Los Angeles', 'larissa.oliveira@example.com', '+44 254-761-6843'],
    ['male', 'Gustavo', 'Souza', '1992-12-03', '1946 Oak Street Phoenix', 'gustavo.souza@example.com', '+1 808-757-9867'],
    ['female', 'Mariana', 'Lopes', '1998-08-19', '1837 Maple Street Indianapolis', 'mariana.lopes@example.com', '+1 240-833-4680'],
    ['male', 'Goncalo', 'Mendes', '1990-07-23', '356 Pine Street San Jose', 'goncalo.mendes@example.com', '+49 584-501-9302'],
    ['female', 'Ximena', 'Flores', '1997-11-18', '21 Cedar Street San Francisco', 'ximena.flores@example.com', '+92 957-686-6804'],
    ['male', 'Mateo', 'Ramirez', '1994-09-23', '164 Elm Street Phoenix', 'mateo.ramirez@example.com', '+91 857-765-4373'],
    ['male', 'Miguel', 'Bautista', '1993-01-14', '1964 Fifth Street Dallas', 'miguel.bautista@example.com', '+49 980-340-5333'],
    ['female', 'Rizalina', 'Villanueva', '1996-04-20', '419 Elm Street Seattle', 'rizalina.villanueva@example.com', '+61 837-389-4095'],
    ['male', 'Lukas', 'Zimmermann', '1992-03-25', '560 Fifth Street Seattle', 'lukas.zimmermann@example.com', '+61 411-514-5320'],
    ['female', 'Lena', 'Schaefer', '1995-04-06', '590 Lincoln Street Houston', 'lena.schaefer@example.com', '+44 687-435-7119'],
    ['female', 'Yuki', 'Tanaka', '1996-06-16', '98 Tenth Street San Antonio', 'yuki.tanaka@example.com', '+61 932-569-4853'],
    ['male', 'Kwame', 'Mensah', '1991-08-21', '1999 Seventh Street San Diego', 'kwame.mensah@example.com', '+44 254-655-6112'],
    ['female', 'Priya', 'Sharma', '1997-11-01', '25 Sixth Street San Diego', 'priya.sharma@example.com', '+61 333-911-3476'],
    ['male', 'Andrei', 'Popescu', '1993-02-02', '666 Fourth Street Phoenix', 'andrei.popescu@example.com', '+92 556-625-4398'],
    ['female', 'Fatou', 'Diallo', '1998-06-14', '55 Madison Street Chicago', 'fatou.diallo@example.com', '+49 212-856-4272'],
    ['male', 'Jinsoo', 'Park', '1994-06-18', '968 Elm Street San Diego', 'jinsoo.park@example.com', '+91 730-486-3735'],
    ['female', 'Amara', 'Okafor', '1995-12-21', '1419 Pine Street Columbus', 'amara.okafor@example.com', '+91 322-775-7582'],
    ['male', 'Ravi', 'Patel', '1990-11-06', '926 Elm Street Jacksonville', 'ravi.patel@example.com', '+92 378-326-3439'],
    ['female', 'Annika', 'Lindqvist', '1997-09-17', '1423 Main Street Jacksonville', 'annika.lindqvist@example.com', '+1 465-379-7226'],
    ['male', 'Kofi', 'Asante', '1992-12-23', '1957 Cedar Street Seattle', 'kofi.asante@example.com', '+49 550-430-8269'],
    ['female', 'Meiling', 'Chen', '1996-04-22', '1094 Adams Street San Antonio', 'meiling.chen@example.com', '+44 926-778-4653'],
    ['male', 'Sergei', 'Volkov', '1991-06-26', '1486 Second Street Chicago', 'sergei.volkov@example.com', '+49 328-635-8057'],
    ['female', 'Aiko', 'Watanabe', '1998-06-17', '1506 Jefferson Street Austin', 'aiko.watanabe@example.com', '+91 458-289-9756'],
    ['male', 'Emmanuel', 'Mbeki', '1993-11-10', '1795 Seventh Street Columbus', 'emmanuel.mbeki@example.com', '+44 540-488-4436'],
    ['female', 'Ingrid', 'Haugen', '1994-03-15', '447 Ninth Street Dallas', 'ingrid.haugen@example.com', '+92 896-206-1901'],
    ['male', 'Tomasz', 'Kowalski', '1992-05-01', '789 Main Street Dallas', 'tomasz.kowalski@example.com', '+1 251-564-2643'],
    ['female', 'Amina', 'Yusuf', '1997-03-09', '1577 Seventh Street Phoenix', 'amina.yusuf@example.com', '+61 857-625-2029'],
    ['male', 'Kenji', 'Nakamura', '1990-05-09', '14 Main Street Phoenix', 'kenji.nakamura@example.com', '+1 394-401-1757'],
  // ─── Singles 2 ─────────────────────────
    ['male', 'Elijah', 'Stewart', '1991-08-19', '554 Seventh Street Austin', 'elijah.stewart@example.com', '+91 453-220-4258'],
    ['male', 'Daniel', 'Cook', '1983-02-05', '466 Sixth Street Philadelphia', 'daniel.cook@example.com', '+91 207-801-7417'],
    ['male', 'Henry', 'Hill', '1986-07-28', '1078 Sixth Street Los Angeles', 'henry.hill@example.com', '+81 351-413-9369'],
    ['female', 'Natalie', 'Harris', '1996-06-01', '1553 Sixth Street San Diego', 'natalie.harris@example.com', '+44 434-406-8551'],
    ['male', 'Jack', 'Ward', '1995-04-08', '240 Jefferson Street San Jose', 'jack.ward@example.com', '+61 386-511-8949'],
    ['female', 'Harper', 'Turner', '1991-10-03', '639 Fourth Street Denver', 'harper.turner@example.com', '+92 657-388-7474'],
    ['male', 'Mason', 'Parker', '1990-11-16', '1656 Eighth Street Denver', 'mason.parker@example.com', '+49 968-571-2475'],
    ['female', 'Aria', 'Roberts', '1998-12-24', '1705 Pine Street Jacksonville', 'aria.roberts@example.com', '+49 638-976-6904'],
    ['male', 'Owen', 'Fisher', '1993-12-07', '236 Lincoln Street Jacksonville', 'owen.fisher@example.com', '+44 618-916-5243'],
    ['male', 'Benjamin', 'Foster', '1990-09-16', '244 Second Street Austin', 'benjamin.foster@example.com', '+91 624-944-2089'],
    ['female', 'Hannah', 'Robinson', '1995-04-19', '1813 Ninth Street Chicago', 'hannah.robinson@example.com', '+44 663-850-4302'],
    ['male', 'Jacob', 'Cooper', '1993-09-14', '571 Washington Street Charlotte', 'jacob.cooper@example.com', '+44 907-679-1302'],
    ['male', 'Eli', 'Bennett', '1995-10-02', '1858 Madison Street San Antonio', 'eli.bennett@example.com', '+92 260-518-7256'],
    ['female', 'Grace', 'Perry', '1998-12-01', '1466 Oak Street Los Angeles', 'grace.perry@example.com', '+44 371-964-4017'],
    ['male', 'Nathan', 'Dixon', '1990-09-25', '1110 Seventh Street San Diego', 'nathan.dixon@example.com', '+61 456-307-5568'],
    ['male', 'Ethan', 'Fletcher', '1991-10-26', '439 Pine Street San Antonio', 'ethan.fletcher@example.com', '+1 232-621-9938'],
    ['male', 'Jonathan', 'Pierce', '1991-01-06', '1581 Oak Street Austin', 'jonathan.pierce@example.com', '+81 693-260-7234'],
    ['female', 'Samantha', 'Howard', '1994-09-18', '756 Washington Street New York', 'samantha.howard@example.com', '+91 688-478-9459'],
    ['female', 'Nora', 'Mills', '1998-09-18', '940 Oak Street San Jose', 'nora.mills@example.com', '+44 767-262-6860'],
  // ─── Cohen Family ────────────────────────────
    ['male', 'David', 'Cohen', '1981-04-23', '847 Third Street Boston', 'david.cohen@example.com', '+1 617-555-1234'],
    ['female', 'Sarah', 'Cohen', '1984-02-15', '847 Third Street Boston', 'sarah.cohen@example.com', '+1 617-555-1235'],
    ['female', 'Yael', 'Cohen', '2006-09-10', '847 Third Street Boston', 'yael.cohen@example.com', '+1 617-555-1236'],
];

const PERSON_MOCK = rawData.map(
  ([gender, firstName, lastName, birthDate, address, email, phone]) => ({
    gender,
    firstName,
    lastName,
    birthDate,
    address,
    email,
    phone,
  })
);

export default PERSON_MOCK;
