const PERSON_MOCK = [
  {
    gender: 'female',
    firstName: 'Emily',
    lastName: 'Johnson',
    birthDate: '1996/5/30',
    address: '626 Main Street Phoenix',
    email: 'emily.johnson@x.dummyjson.com',
    phone: '+81 965-431-3024',
  },
  {
    gender: 'male',
    firstName: 'Michael',
    lastName: 'Williams',
    birthDate: '1989/8/10',
    address: '385 Fifth Street Houston',
    email: 'michael.williams@x.dummyjson.com',
    phone: '+49 258-627-6644',
  },
  {
    gender: 'female',
    firstName: 'Sophia',
    lastName: 'Brown',
    birthDate: '1982/11/6',
    address: '1642 Ninth Street Washington',
    email: 'sophia.brown@x.dummyjson.com',
    phone: '+81 210-652-2785',
  },
  {
    gender: 'male',
    firstName: 'James',
    lastName: 'Davis',
    birthDate: '1979/5/4',
    address: '238 Jefferson Street Seattle',
    email: 'james.davis@x.dummyjson.com',
    phone: '+49 614-958-9364',
  },
  {
    gender: 'female',
    firstName: 'Emma',
    lastName: 'Miller',
    birthDate: '1994/6/13',
    address: '607 Fourth Street Jacksonville',
    email: 'emma.miller@x.dummyjson.com',
    phone: '+91 759-776-1614',
  },
  {
    gender: 'female',
    firstName: 'Olivia',
    lastName: 'Wilson',
    birthDate: '2002/4/20',
    address: '547 First Street Fort Worth',
    email: 'olivia.wilson@x.dummyjson.com',
    phone: '+91 607-295-6448',
  },
  {
    gender: 'male',
    firstName: 'Alexander',
    lastName: 'Jones',
    birthDate: '1986/10/20',
    address: '664 Maple Street Indianapolis',
    email: 'alexander.jones@x.dummyjson.com',
    phone: '+61 260-824-4986',
  },
  {
    gender: 'female',
    firstName: 'Ava',
    lastName: 'Taylor',
    birthDate: '1997/8/25',
    address: '1197 First Street Fort Worth',
    email: 'ava.taylor@x.dummyjson.com',
    phone: '+1 458-853-7877',
  },
  {
    gender: 'male',
    firstName: 'Ethan',
    lastName: 'Martinez',
    birthDate: '1991/2/12',
    address: '466 Pine Street San Antonio',
    email: 'ethan.martinez@x.dummyjson.com',
    phone: '+92 933-608-5081',
  },
  {
    gender: 'female',
    firstName: 'Isabella',
    lastName: 'Anderson',
    birthDate: '1993/6/10',
    address: '1964 Oak Street New York',
    email: 'isabella.anderson@x.dummyjson.com',
    phone: '+49 770-658-4885',
  },
  {
    gender: 'male',
    firstName: 'Liam',
    lastName: 'Garcia',
    birthDate: '1995/6/6',
    address: '576 Fifth Street Denver',
    email: 'liam.garcia@x.dummyjson.com',
    phone: '+92 870-217-6201',
  },
  {
    gender: 'female',
    firstName: 'Mia',
    lastName: 'Rodriguez',
    birthDate: '2000/8/4',
    address: '1627 Sixth Street Jacksonville',
    email: 'mia.rodriguez@x.dummyjson.com',
    phone: '+49 989-461-8403',
  },
  {
    gender: 'male',
    firstName: 'Noah',
    lastName: 'Hernandez',
    birthDate: '1984/6/5',
    address: '1413 Maple Street New York',
    email: 'noah.hernandez@x.dummyjson.com',
    phone: '+49 393-605-6968',
  },
  {
    gender: 'female',
    firstName: 'Charlotte',
    lastName: 'Lopez',
    birthDate: '1988/6/8',
    address: '208 Second Street Columbus',
    email: 'charlotte.lopez@x.dummyjson.com',
    phone: '+44 373-953-5028',
  },
  {
    gender: 'male',
    firstName: 'William',
    lastName: 'Gonzalez',
    birthDate: '1992/3/27',
    address: '31 Maple Street San Jose',
    email: 'william.gonzalez@x.dummyjson.com',
    phone: '+81 905-252-7319',
  },
  {
    gender: 'female',
    firstName: 'Avery',
    lastName: 'Perez',
    birthDate: '1999/3/10',
    address: '1125 First Street Columbus',
    email: 'avery.perez@x.dummyjson.com',
    phone: '+61 731-431-3457',
  },
  {
    gender: 'female',
    firstName: 'Evelyn',
    lastName: 'Sanchez',
    birthDate: '1987/10/13',
    address: '1170 Lincoln Street San Diego',
    email: 'evelyn.sanchez@x.dummyjson.com',
    phone: '+1 623-880-6871',
  },
  {
    gender: 'male',
    firstName: 'Logan',
    lastName: 'Torres',
    birthDate: '1993/10/26',
    address: '907 Seventh Street Columbus',
    email: 'logan.torres@x.dummyjson.com',
    phone: '+81 507-434-8733',
  },
  {
    gender: 'female',
    firstName: 'Abigail',
    lastName: 'Rivera',
    birthDate: '1996/10/11',
    address: '996 Oak Street Chicago',
    email: 'abigail.rivera@x.dummyjson.com',
    phone: '+91 228-363-7806',
  },
  {
    gender: 'male',
    firstName: 'Jackson',
    lastName: 'Evans',
    birthDate: '1990/11/30',
    address: '1873 Main Street New York',
    email: 'jackson.evans@x.dummyjson.com',
    phone: '+44 468-628-6686',
  },
  {
    gender: 'female',
    firstName: 'Madison',
    lastName: 'Collins',
    birthDate: '1998/3/7',
    address: '1892 Lincoln Street Philadelphia',
    email: 'madison.collins@x.dummyjson.com',
    phone: '+81 259-957-5711',
  },
  {
    gender: 'male',
    firstName: 'Elijah',
    lastName: 'Stewart',
    birthDate: '1991/10/22',
    address: '1701 Eighth Street Columbus',
    email: 'elijah.stewart@x.dummyjson.com',
    phone: '+44 468-357-7872',
  },
  {
    gender: 'female',
    firstName: 'Chloe',
    lastName: 'Morales',
    birthDate: '1985/4/21',
    address: '401 Fourth Street Dallas',
    email: 'chloe.morales@x.dummyjson.com',
    phone: '+92 468-541-7133',
  },
  {
    gender: 'male',
    firstName: 'Mateo',
    lastName: 'Nguyen',
    birthDate: '1994/6/2',
    address: '1578 Fourth Street Columbus',
    email: 'mateo.nguyen@x.dummyjson.com',
    phone: '+1 341-597-6694',
  },
  {
    gender: 'female',
    firstName: 'Harper',
    lastName: 'Kelly',
    birthDate: '1997/3/3',
    address: '1591 Adams Street Philadelphia',
    email: 'harper.kelly@x.dummyjson.com',
    phone: '+92 518-863-2863',
  },
  {
    gender: 'female',
    firstName: 'Evelyn',
    lastName: 'Gonzalez',
    birthDate: '1989/2/5',
    address: '1065 Lincoln Street Dallas',
    email: 'evelyn.gonzalez@x.dummyjson.com',
    phone: '+61 708-508-4638',
  },
  {
    gender: 'male',
    firstName: 'Daniel',
    lastName: 'Cook',
    birthDate: '1983/12/25',
    address: '1163 Pine Street Los Angeles',
    email: 'daniel.cook@x.dummyjson.com',
    phone: '+44 254-761-6843',
  },
  {
    gender: 'female',
    firstName: 'Lily',
    lastName: 'Lee',
    birthDate: '1995/12/3',
    address: '1946 Oak Street Phoenix',
    email: 'lily.lee@x.dummyjson.com',
    phone: '+1 808-757-9867',
  },
  {
    gender: 'male',
    firstName: 'Henry',
    lastName: 'Hill',
    birthDate: '1986/8/19',
    address: '1837 Maple Street Indianapolis',
    email: 'henry.hill@x.dummyjson.com',
    phone: '+1 240-833-4680',
  },
  {
    gender: 'female',
    firstName: 'Addison',
    lastName: 'Wright',
    birthDate: '1992/1/3',
    address: '568 Tenth Street San Francisco',
    email: 'addison.wright@x.dummyjson.com',
    phone: '+1 514-384-3300',
  },
  {
    gender: 'male',
    firstName: 'Gabriel',
    lastName: 'Adams',
    birthDate: '1988/9/5',
    address: '1814 Cedar Street Charlotte',
    email: 'gabriel.adams@x.dummyjson.com',
    phone: '+91 936-400-4116',
  },
  {
    gender: 'female',
    firstName: 'Natalie',
    lastName: 'Harris',
    birthDate: '1996/7/23',
    address: '356 Pine Street San Jose',
    email: 'natalie.harris@x.dummyjson.com',
    phone: '+49 584-501-9302',
  },
  {
    gender: 'male',
    firstName: 'Carter',
    lastName: 'Baker',
    birthDate: '1993/4/19',
    address: '625 Third Street Denver',
    email: 'carter.baker@x.dummyjson.com',
    phone: '+49 787-512-9117',
  },
  {
    gender: 'female',
    firstName: 'Sofia',
    lastName: 'Mitchell',
    birthDate: '1999/11/18',
    address: '21 Cedar Street San Francisco',
    email: 'sofia.mitchell@x.dummyjson.com',
    phone: '+92 957-686-6804',
  },
  {
    gender: 'male',
    firstName: 'Jack',
    lastName: 'Ward',
    birthDate: '1995/9/23',
    address: '164 Elm Street Phoenix',
    email: 'jack.ward@x.dummyjson.com',
    phone: '+91 857-765-4373',
  },
  {
    gender: 'female',
    firstName: 'Harper',
    lastName: 'Turner',
    birthDate: '1991/1/14',
    address: '1964 Fifth Street Dallas',
    email: 'harper.turner@x.dummyjson.com',
    phone: '+49 980-340-5333',
  },
  {
    gender: 'male',
    firstName: 'Mason',
    lastName: 'Parker',
    birthDate: '1990/4/20',
    address: '419 Elm Street Seattle',
    email: 'mason.parker@x.dummyjson.com',
    phone: '+61 837-389-4095',
  },
  {
    gender: 'female',
    firstName: 'Aria',
    lastName: 'Roberts',
    birthDate: '1998/3/25',
    address: '560 Fifth Street Seattle',
    email: 'aria.roberts@x.dummyjson.com',
    phone: '+61 411-514-5320',
  },
  {
    gender: 'male',
    firstName: 'Lucas',
    lastName: 'Gray',
    birthDate: '1994/4/6',
    address: '590 Lincoln Street Houston',
    email: 'lucas.gray@x.dummyjson.com',
    phone: '+44 687-435-7119',
  },
  {
    gender: 'female',
    firstName: 'Ella',
    lastName: 'Adams',
    birthDate: '1997/6/20',
    address: '1420 First Street Washington',
    email: 'ella.adams@x.dummyjson.com',
    phone: '+1 450-865-6061',
  },
  {
    gender: 'male',
    firstName: 'Evan',
    lastName: 'Reed',
    birthDate: '1992/6/16',
    address: '98 Tenth Street San Antonio',
    email: 'evan.reed@x.dummyjson.com',
    phone: '+61 932-569-4853',
  },
  {
    gender: 'female',
    firstName: 'Avery',
    lastName: 'Carter',
    birthDate: '1996/8/21',
    address: '1999 Seventh Street San Diego',
    email: 'avery.carter@x.dummyjson.com',
    phone: '+44 254-655-6112',
  },
  {
    gender: 'male',
    firstName: 'Benjamin',
    lastName: 'Foster',
    birthDate: '1990/11/1',
    address: '25 Sixth Street San Diego',
    email: 'benjamin.foster@x.dummyjson.com',
    phone: '+61 333-911-3476',
  },
  {
    gender: 'female',
    firstName: 'Scarlett',
    lastName: 'Wright',
    birthDate: '1998/5/9',
    address: '1276 Cedar Street Phoenix',
    email: 'scarlett.wright@x.dummyjson.com',
    phone: '+1 599-432-3048',
  },
  {
    gender: 'male',
    firstName: 'Lincoln',
    lastName: 'Kelly',
    birthDate: '1994/1/12',
    address: '108 Adams Street Columbus',
    email: 'lincoln.kelly@x.dummyjson.com',
    phone: '+49 680-666-9673',
  },
  {
    gender: 'female',
    firstName: 'Hannah',
    lastName: 'Robinson',
    birthDate: '1995/2/2',
    address: '666 Fourth Street Phoenix',
    email: 'hannah.robinson@x.dummyjson.com',
    phone: '+92 556-625-4398',
  },
  {
    gender: 'male',
    firstName: 'Nicholas',
    lastName: 'Bailey',
    birthDate: '1989/6/14',
    address: '55 Madison Street Chicago',
    email: 'nicholas.bailey@x.dummyjson.com',
    phone: '+49 212-856-4272',
  },
  {
    gender: 'female',
    firstName: 'Luna',
    lastName: 'Russell',
    birthDate: '1997/6/18',
    address: '968 Elm Street San Diego',
    email: 'luna.russell@x.dummyjson.com',
    phone: '+91 730-486-3735',
  },
  {
    gender: 'male',
    firstName: 'Jacob',
    lastName: 'Cooper',
    birthDate: '1993/12/21',
    address: '1419 Pine Street Columbus',
    email: 'jacob.cooper@x.dummyjson.com',
    phone: '+91 322-775-7582',
  },
  {
    gender: 'female',
    firstName: 'Stella',
    lastName: 'Hughes',
    birthDate: '1991/11/6',
    address: '926 Elm Street Jacksonville',
    email: 'stella.hughes@x.dummyjson.com',
    phone: '+92 378-326-3439',
  },
  {
    gender: 'male',
    firstName: 'Eli',
    lastName: 'Bennett',
    birthDate: '1995/9/17',
    address: '1423 Main Street Jacksonville',
    email: 'eli.bennett@x.dummyjson.com',
    phone: '+1 465-379-7226',
  },
  {
    gender: 'female',
    firstName: 'Grace',
    lastName: 'Perry',
    birthDate: '1998/12/23',
    address: '1957 Cedar Street Seattle',
    email: 'grace.perry@x.dummyjson.com',
    phone: '+49 550-430-8269',
  },
  {
    gender: 'male',
    firstName: 'Lucas',
    lastName: 'Gordon',
    birthDate: '1989/9/11',
    address: '1386 Third Street Los Angeles',
    email: 'lucas.gordon@x.dummyjson.com',
    phone: '+81 367-320-4960',
  },
  {
    gender: 'female',
    firstName: 'Ava',
    lastName: 'Harrison',
    birthDate: '1996/4/22',
    address: '1094 Adams Street San Antonio',
    email: 'ava.harrison@x.dummyjson.com',
    phone: '+44 926-778-4653',
  },
  {
    gender: 'male',
    firstName: 'Owen',
    lastName: 'Fisher',
    birthDate: '1993/6/26',
    address: '1486 Second Street Chicago',
    email: 'owen.fisher@x.dummyjson.com',
    phone: '+49 328-635-8057',
  },
  {
    gender: 'female',
    firstName: 'Samantha',
    lastName: 'Howard',
    birthDate: '1994/6/17',
    address: '1506 Jefferson Street Austin',
    email: 'samantha.howard@x.dummyjson.com',
    phone: '+91 458-289-9756',
  },
  {
    gender: 'male',
    firstName: 'Nathan',
    lastName: 'Dixon',
    birthDate: '1990/11/10',
    address: '1795 Seventh Street Columbus',
    email: 'nathan.dixon@x.dummyjson.com',
    phone: '+44 540-488-4436',
  },
  {
    gender: 'female',
    firstName: 'Bella',
    lastName: 'Grant',
    birthDate: '1997/3/15',
    address: '447 Ninth Street Dallas',
    email: 'bella.grant@x.dummyjson.com',
    phone: '+92 896-206-1901',
  },
  {
    gender: 'male',
    firstName: 'Ethan',
    lastName: 'Fletcher',
    birthDate: '1991/5/1',
    address: '789 Main Street Dallas',
    email: 'ethan.fletcher@x.dummyjson.com',
    phone: '+1 251-564-2643',
  },
  {
    gender: 'female',
    firstName: 'Lillian',
    lastName: 'Simmons',
    birthDate: '1992/3/9',
    address: '1577 Seventh Street Phoenix',
    email: 'lillian.simmons@x.dummyjson.com',
    phone: '+61 857-625-2029',
  },
  {
    gender: 'male',
    firstName: 'Mason',
    lastName: 'Pearson',
    birthDate: '1996/5/9',
    address: '14 Main Street Phoenix',
    email: 'mason.pearson@x.dummyjson.com',
    phone: '+1 394-401-1757',
  },
  {
    gender: 'female',
    firstName: 'Leah',
    lastName: 'Henderson',
    birthDate: '1998/8/19',
    address: '554 Seventh Street Austin',
    email: 'leah.henderson@x.dummyjson.com',
    phone: '+91 453-220-4258',
  },
  {
    gender: 'male',
    firstName: 'Logan',
    lastName: 'Lawson',
    birthDate: '1991/8/5',
    address: '1110 Fifth Street Chicago',
    email: 'logan.lawson@x.dummyjson.com',
    phone: '+1 750-526-9455',
  },
  {
    gender: 'female',
    firstName: 'Avery',
    lastName: 'Barnes',
    birthDate: '1995/2/5',
    address: '466 Sixth Street Philadelphia',
    email: 'avery.barnes@x.dummyjson.com',
    phone: '+91 207-801-7417',
  },
  {
    gender: 'male',
    firstName: 'Caleb',
    lastName: 'Perkins',
    birthDate: '1994/7/28',
    address: '1078 Sixth Street Los Angeles',
    email: 'caleb.perkins@x.dummyjson.com',
    phone: '+81 351-413-9369',
  },
  {
    gender: 'female',
    firstName: 'Aria',
    lastName: 'Ferguson',
    birthDate: '1997/6/1',
    address: '1553 Sixth Street San Diego',
    email: 'aria.ferguson@x.dummyjson.com',
    phone: '+44 434-406-8551',
  },
  {
    gender: 'male',
    firstName: 'Gabriel',
    lastName: 'Hayes',
    birthDate: '1990/4/8',
    address: '240 Jefferson Street San Jose',
    email: 'gabriel.hayes@x.dummyjson.com',
    phone: '+61 386-511-8949',
  },
  {
    gender: 'female',
    firstName: 'Layla',
    lastName: 'Sullivan',
    birthDate: '1999/10/3',
    address: '639 Fourth Street Denver',
    email: 'layla.sullivan@x.dummyjson.com',
    phone: '+92 657-388-7474',
  },
  {
    gender: 'male',
    firstName: 'Christopher',
    lastName: 'West',
    birthDate: '1993/11/16',
    address: '1656 Eighth Street Denver',
    email: 'christopher.west@x.dummyjson.com',
    phone: '+49 968-571-2475',
  },
  {
    gender: 'female',
    firstName: 'Zoe',
    lastName: 'Nicholson',
    birthDate: '1992/12/24',
    address: '1705 Pine Street Jacksonville',
    email: 'zoe.nicholson@x.dummyjson.com',
    phone: '+49 638-976-6904',
  },
  {
    gender: 'male',
    firstName: 'Nolan',
    lastName: 'Bryant',
    birthDate: '1995/12/7',
    address: '236 Lincoln Street Jacksonville',
    email: 'nolan.bryant@x.dummyjson.com',
    phone: '+44 618-916-5243',
  },
  {
    gender: 'female',
    firstName: 'Victoria',
    lastName: 'McDonald',
    birthDate: '1997/9/16',
    address: '244 Second Street Austin',
    email: 'victoria.mcdonald@x.dummyjson.com',
    phone: '+91 624-944-2089',
  },
  {
    gender: 'male',
    firstName: 'Max',
    lastName: 'Russell',
    birthDate: '1990/4/19',
    address: '1813 Ninth Street Chicago',
    email: 'max.russell@x.dummyjson.com',
    phone: '+44 663-850-4302',
  },
  {
    gender: 'female',
    firstName: 'Penelope',
    lastName: 'Harper',
    birthDate: '1996/9/14',
    address: '571 Washington Street Charlotte',
    email: 'penelope.harper@x.dummyjson.com',
    phone: '+44 907-679-1302',
  },
  {
    gender: 'male',
    firstName: 'Ryan',
    lastName: 'Graham',
    birthDate: '1993/10/2',
    address: '1858 Madison Street San Antonio',
    email: 'ryan.graham@x.dummyjson.com',
    phone: '+92 260-518-7256',
  },
  {
    gender: 'female',
    firstName: 'Madeline',
    lastName: 'Simpson',
    birthDate: '1998/12/1',
    address: '1466 Oak Street Los Angeles',
    email: 'madeline.simpson@x.dummyjson.com',
    phone: '+44 371-964-4017',
  },
  {
    gender: 'male',
    firstName: 'Jonathan',
    lastName: 'Pierce',
    birthDate: '1991/9/25',
    address: '1110 Seventh Street San Diego',
    email: 'jonathan.pierce@x.dummyjson.com',
    phone: '+61 456-307-5568',
  },
  {
    gender: 'female',
    firstName: 'Eleanor',
    lastName: 'Tyler',
    birthDate: '1994/10/26',
    address: '439 Pine Street San Antonio',
    email: 'eleanor.tyler@x.dummyjson.com',
    phone: '+1 232-621-9938',
  },
  {
    gender: 'male',
    firstName: 'Isaac',
    lastName: 'Lawrence',
    birthDate: '1992/1/6',
    address: '1581 Oak Street Austin',
    email: 'isaac.lawrence@x.dummyjson.com',
    phone: '+81 693-260-7234',
  },
  {
    gender: 'female',
    firstName: 'Hazel',
    lastName: 'Gardner',
    birthDate: '1997/9/18',
    address: '756 Washington Street New York',
    email: 'hazel.gardner@x.dummyjson.com',
    phone: '+91 688-478-9459',
  },
  {
    gender: 'male',
    firstName: 'Austin',
    lastName: 'Hudson',
    birthDate: '1995/5/1',
    address: '1468 Eighth Street Los Angeles',
    email: 'austin.hudson@x.dummyjson.com',
    phone: '+81 405-412-4250',
  },
  {
    gender: 'female',
    firstName: 'Lillian',
    lastName: 'Bishop',
    birthDate: '1998/8/2',
    address: '1959 Lincoln Street Jacksonville',
    email: 'lillian.bishop@x.dummyjson.com',
    phone: '+92 538-589-5885',
  },
  {
    gender: 'male',
    firstName: 'Dylan',
    lastName: 'Wells',
    birthDate: '1990/11/7',
    address: '816 Sixth Street Philadelphia',
    email: 'dylan.wells@x.dummyjson.com',
    phone: '+49 659-638-1106',
  },
  {
    gender: 'female',
    firstName: 'Aaliyah',
    lastName: 'Hanson',
    birthDate: '1996/3/20',
    address: '790 Eighth Street Philadelphia',
    email: 'aaliyah.hanson@x.dummyjson.com',
    phone: '+1 275-501-1119',
  },
  {
    gender: 'male',
    firstName: 'Cameron',
    lastName: 'Burke',
    birthDate: '1993/2/28',
    address: '1192 Adams Street Denver',
    email: 'cameron.burke@x.dummyjson.com',
    phone: '+1 976-686-7996',
  },
  {
    gender: 'female',
    firstName: 'Nora',
    lastName: 'Mills',
    birthDate: '1998/9/18',
    address: '940 Oak Street San Jose',
    email: 'nora.mills@x.dummyjson.com',
    phone: '+44 767-262-6860',
  },
  {
    gender: 'male',
    firstName: 'Hunter',
    lastName: 'Gordon',
    birthDate: '1991/2/8',
    address: '614 Third Street Charlotte',
    email: 'hunter.gordon@x.dummyjson.com',
    phone: '+1 986-988-5297',
  },
  {
    gender: 'female',
    firstName: 'Aubrey',
    lastName: 'Wagner',
    birthDate: '1994/4/1',
    address: '1147 Adams Street Phoenix',
    email: 'aubrey.wagner@x.dummyjson.com',
    phone: '+81 285-568-5834',
  },
  {
    gender: 'male',
    firstName: 'Brayden',
    lastName: 'Fleming',
    birthDate: '1992/7/20',
    address: '328 Second Street Jacksonville',
    email: 'brayden.fleming@x.dummyjson.com',
    phone: '+1 404-382-1778',
  },
  {
    gender: 'female',
    firstName: 'Scarlett',
    lastName: 'Bowman',
    birthDate: '1997/2/26',
    address: '1108 Madison Street New York',
    email: 'scarlett.bowman@x.dummyjson.com',
    phone: '+44 928-549-7517',
  },
  {
    gender: 'male',
    firstName: 'Levi',
    lastName: 'Hicks',
    birthDate: '1995/5/19',
    address: '1836 Pine Street Phoenix',
    email: 'levi.hicks@x.dummyjson.com',
    phone: '+92 931-753-3850',
  },
  {
    gender: 'female',
    firstName: 'Autumn',
    lastName: 'Gomez',
    birthDate: '1998/2/1',
    address: '1585 Washington Street Dallas',
    email: 'autumn.gomez@x.dummyjson.com',
    phone: '+1 340-455-2897',
  },
  {
    gender: 'male',
    firstName: 'Julian',
    lastName: 'Newton',
    birthDate: '1990/7/2',
    address: '565 First Street Fort Worth',
    email: 'julian.newton@x.dummyjson.com',
    phone: '+92 865-328-8737',
  },
  {
    gender: 'female',
    firstName: 'Ruby',
    lastName: 'Andrews',
    birthDate: '1996/7/7',
    address: '800 Adams Street Dallas',
    email: 'ruby.andrews@x.dummyjson.com',
    phone: '+1 343-203-7912',
  },
  {
    gender: 'male',
    firstName: 'Miles',
    lastName: 'Stevenson',
    birthDate: '1993/3/1',
    address: '1778 Tenth Street Charlotte',
    email: 'miles.stevenson@x.dummyjson.com',
    phone: '+49 708-659-4394',
  },
  {
    gender: 'female',
    firstName: 'Aurora',
    lastName: 'Lawson',
    birthDate: '1998/6/16',
    address: '1140 Adams Street Dallas',
    email: 'aurora.lawson@x.dummyjson.com',
    phone: '+92 802-452-4192',
  },
  {
    gender: 'male',
    firstName: 'Oscar',
    lastName: 'Powers',
    birthDate: '1991/9/7',
    address: '1948 Jefferson Street Charlotte',
    email: 'oscar.powers@x.dummyjson.com',
    phone: '+61 929-572-1408',
  },
  {
    gender: 'female',
    firstName: 'Clara',
    lastName: 'Berry',
    birthDate: '1994/2/13',
    address: '1577 Jefferson Street Seattle',
    email: 'clara.berry@x.dummyjson.com',
    phone: '+1 390-831-5172',
  },
  {
    gender: 'male',
    firstName: 'Gavin',
    lastName: 'Stanley',
    birthDate: '1992/3/17',
    address: '1898 Second Street Houston',
    email: 'gavin.stanley@x.dummyjson.com',
    phone: '+44 466-358-6026',
  },
  {
    gender: 'female',
    firstName: 'Lila',
    lastName: 'Hudson',
    birthDate: '1997/9/1',
    address: '262 Ninth Street Chicago',
    email: 'lila.hudson@x.dummyjson.com',
    phone: '+91 697-236-1544',
  },
];

export default PERSON_MOCK;
