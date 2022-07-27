'use strict';
import DataTable from "./dataTable";
import { faker } from '@faker-js/faker';

const arrOne = [];
const arrTwo = [];

for (let i = 1; i < 51; i++) {
    const obj = {};
    const name = faker.name.findName().split(' ');
    const address = {
        streetAddress: faker.address.street(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode()
    }
    obj['id'] = i;
    obj['firstName'] = name[0];
    obj['lastName'] = name[1];
    obj['email'] = faker.internet.email();
    obj['phone'] = faker.phone.number();
    obj['address'] = address;
    obj['description'] = faker.word.conjunction();

    arrOne.push(obj);
}

for (let i = 1; i < 1001; i++) {
    const obj = {};
    const name = faker.name.findName().split(' ');
    const address = {
        streetAddress: faker.address.street(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode()
    }
    obj['id'] = i;
    obj['firstName'] = name[0];
    obj['lastName'] = name[1];
    obj['email'] = faker.internet.email();
    obj['phone'] = faker.phone.number();
    obj['address'] = address;
    obj['description'] = faker.word.conjunction();

    arrTwo.push(obj);
}


//Таблицы заполняются случайно сгенерированными данными с помощью faker.js
const dataTableFakeOne = new DataTable(arrOne).render();
const dataTableFakeTwo = new DataTable(arrTwo).render();

//Данные которые не подгружаются с сервера на GitHub - он ругается что данные берутся не https, а не http. Локально на компьютере данные загружаются.
// const dataTableSmall = new DataTable('http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D').render();

// const dataTableBig = new DataTable('http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D').render();
