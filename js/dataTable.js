'use strict';

class DataTable {
    constructor(url){
        this.url = url;

    }
    //метод с fetch
    render () {
        //Создаем таблицу на странице
        const body = document.querySelector('body');//Получаем тело страницы
        //Создаем контейнер для всей таблицы, форм, дополнительных данных
        const tableBody = document.createElement('div');
        tableBody.classList.add('tableBody');
        body.append(tableBody);
        tableBody.style.margin = '0px auto';
        const table = document.createElement('div');//Создаем таблицу
        table.classList.add('spisok');//Добавляем таблице класс CSS
        const headings = document.createElement('div');//Создаем строку с заголовками таблицы
        headings.classList.add('headings');
        tableBody.prepend(table);//Добавлем таблицу в тело страницы
        table.prepend(headings);//Добавляем заголовки в таблицу
        //Заполнем заголовки таблицы
        headings.innerHTML =`<div>id▲</div>
                        <div>firstName▲</div>
                        <div>lastName▲</div>
                        <div>email▲</div>
                        <div>phone▲</div>`;
        //Добавлем заголовкам с помощью цикла класс из CSS 
        const headingDiv = tableBody.querySelectorAll('.headings div');
        headingDiv.forEach(el => {
            el.classList.add('heading');
        });
        //Создаем контейнер для наполнения ячеек с пользователями и их данными
        const conteinerUser = document.createElement('div');
        conteinerUser.classList.add('conteiner-User');
        table.append(conteinerUser);

        // table.style.width = headings.offsetWidth +'px';//Задаем ширину таблицы равной ширине заголовка

        let arrObj = [];//Массив куда будут записываться данные с сервера

        let offset = 0;//отступ для переключения страниц

        let pageNumArr = [];//Массив нумерации для страниц

        //Функция запроса данных с сервера. Взял из курса Ивана Петреченко
        const getResource = async (url) => {//async, await добавляем чтобы код выполнялся асинхронно
            let res = await fetch(url);//Отправляем данные на сервер

            //Условие при котором произошла ошибка
            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status} `);
            }
            
            return await res.json();
        };

        //Функция записи строки в таблицу из массива
        function writingStringTable(array) {
            array.forEach(el => {
                const cells = document.createElement('div');//Создаем контейнер для строки таблицы
                cells.classList.add('cells');//Присваиваем ему класс cells из CSS
                conteinerUser.append(cells);//Добавлем в таблицу
                //Записываем данные в строку таблицы
                cells.innerHTML += `<div class="cell click_cells">${el.id}</div>
                <div class="cell click_cells">${el.firstName}</div>
                <div class="cell click_cells">${el.lastName}</div>
                <div class="cell click_cells">${el.email}</div>
                <div class="cell click_cells">${el.phone}</div>`;
            });
        }

        //функция вывода нумерации страниц, если строки таблицы не помещаются в таблицу
        function writingPageNum() {
            let pageNum = (conteinerUser.scrollWidth)/(tableBody.querySelector('.cells').offsetWidth); //количество страниц
            const indicator = document.createElement('div');//Добавляем контейнер для точек переключения
            tableBody.append(indicator);//Добавляем индикатор в тело страницы
            indicator.classList.add('num');//Присваиваем ему класс num из CSS
            //С помощью цикла создаем кнопки переключения страниц таблицы
            for (let i = 1; i <= pageNum; i++) {
                const num = document.createElement('div');//Создаем контейнер для кнопки
                num.style.cssText = 'height: 30px; width: 30px; background: grey; margin: 10px; opacity: 0.5;';//Добавляем ему стили
                num.textContent = i;//Добавляем текст в контейнер соответствующий номеру страницы
                num.setAttribute('data-slide-to', i);//Добавляем дата атрибут точке соответствующей номеру страницы
                //Подсветка активной точки
                if (i == 1) {
                    num.style.opacity = 1;
                }
                indicator.append(num);//Добавляем div кнопки в контейнер для точек переключения
                pageNumArr.push(num);//Добавляем в массив кнопку, что бы потом его перебрать и навесить на каждую кнопку обработчик событий
            }
            //Перебираем pageNumArr, навешивая на каждую кнопку обработчик событий
            pageNumArr.forEach(num => {
                num.addEventListener('click', (e) => {
                    console.log('Сработал');//Проверяем сработку нажатия на кнопку
                    const slideTo = e.target.getAttribute('data-slide-to');//Обращаемся к слайду с определенным атрибутом, то есть рузультат будет от 1 до сколько всего страниц
                    console.log(slideTo);//Проверил в консоли
                    offset = (tableBody.querySelector('.cells').offsetWidth) * (slideTo-1);//Определем отступ на который перемещается слайд умножая ширину одной строки таблицы на номер страницы - 1
                    conteinerUser.style.transform = `translateX(-${offset}px)`;//Перемещаемся до слайда
                    pageNumArr.forEach(num => num.style.opacity = '.5');//Все точки прозрачные
                    pageNumArr[slideTo-1].style.opacity = 1;//Активная точка
            
                });
            });
        }

        //Создаем спиннер загрузки
        let statusMessage = document.createElement('img');
        statusMessage.src = 'img/spinner.svg';
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;`;
        conteinerUser.append(statusMessage);

        //Проверка если this.url = адрес в ввиде строки, то делаем запрос на сервер через fetch, если массив то по другому
        if (typeof this.url == "string") {
            //Цепочка промисов после получения данных сервера и поэтапной обработки этих данных
            getResource(this.url).then(data => {
                //Сортируем пришедший массив данные по возрастанию по id
                data.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    }
                    if (a.id < b.id) {
                        return -1;
                    }
                    // a должно быть равным b
                    return 0;
                });
                return data;
            }).then (data => {
                arrObj = data;//Записываем в массив arrObj данные с пришедшего массива 
                //С помощью цикла записываем в таблицу данные с массива
                statusMessage.remove();
                writingStringTable(arrObj);//Записываем строки в таблицу
                //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
                if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                    writingPageNum();
                }
            });
        } else {
            let array = this.url;
            array.sort(function (a, b) {
                if (a.id > b.id) {
                    return 1;
                }
                if (a.id < b.id) {
                    return -1;
                }
            });
            arrObj = array;
            statusMessage.remove();
            writingStringTable(arrObj);//Записываем строки в таблицу
            //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
            if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                    writingPageNum();
            }
        }

    

        //Функция сортировки
        const heading = tableBody.querySelectorAll('.heading');
        console.log(heading[0].textContent);
        function sortHeading (indexHeading, valueHeading, objKey) {

            heading[indexHeading].addEventListener('click', () => {
                console.log('сработал');
                if (heading[indexHeading].textContent == valueHeading+'▲') {
                    heading[indexHeading].textContent= valueHeading+'▼';
                    //Сортировка по возрастанию
                    arrObj.sort(function (a, b) {
                        if (a[objKey] < b[objKey]) {
                            return 1;
                        }
                        if (a[objKey] > b[objKey]) {
                            return -1;
                        }
                        // a должно быть равным b
                        return 0;
                    });
            
                    //Зачищаем предыдущий вариант сортировку в таблице
                    tableBody.querySelectorAll('.cells').forEach(el => {
                        el.remove();
                    });
                    //Удаляем нумерацию страниц
                    if (tableBody.querySelector('.num')) {
                        tableBody.querySelector('.num').remove();//Удаляем страницы из DOM дерева
                        pageNumArr = [];//Удаляем страницы из массива
                    }
            
                    //Записываем заново вариант сортировки по возрастанию
                    writingStringTable(arrObj);//Записываем строки в таблицу
                    //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
                    if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                        writingPageNum();
                    }
                } else {
                    heading[indexHeading].textContent=valueHeading+'▲';
                    //Сортировка по убыванию
                    arrObj.sort(function (a, b) {
                        if (a[objKey] > b[objKey]) {
                            return 1;
                        }
                        if (a[objKey] < b[objKey]) {
                            return -1;
                        }
                        // a должно быть равным b
                        return 0;
                    });
            
                    //Зачищаем предыдущий вариант сортировку в таблице
                    tableBody.querySelectorAll('.cells').forEach(el => {
                        el.remove();
                        
                    });
                    //Удаляем нумерацию страниц
                    if (tableBody.querySelector('.num')) {
                        tableBody.querySelector('.num').remove();//Удаляем страницы из DOM дерева
                        pageNumArr = [];//Удаляем страницы из массива
                    }
            
                    //Записываем заново вариант сортировки по возрастанию
                    writingStringTable(arrObj);//Записываем строки в таблицу
                    //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
                    if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                        writingPageNum();
                    }
                }
            });
        }

        sortHeading (0, 'id', 'id');
        sortHeading (1, 'firstName', 'firstName');
        sortHeading (2, 'lastName', 'lastName');
        sortHeading (3, 'email', 'email');
        sortHeading (4, 'phone', 'phone');

        //Текстовое поле с поиском по таблице, сбросом поиска и добавлением нового пользователя
        const forms = document.createElement('div');//Создаем контейнер для форм
        const formSearch = document.createElement('form');//Создаем форму поиск
        formSearch.innerHTML = '<input class="input_val" type="text" placeholder="Введите текст"><input class="input_btn" type="submit" value="Найти">';//Вставляем в нее поле ввода и кнопку поиска
        const formRezet = document.createElement('form');//Создаем форму сброса
        formRezet.innerHTML = '<input class="rezet" type="submit" value="Сброс">';//Вставляем в нее кнопку сброса
        const formAdd = document.createElement('form');//Создаем форму добавления нового пользователя
        formAdd.innerHTML = '<input class="addUser" type="submit" value="Добавить">';//Вставляем в нее кнопку вызова формы нового пользователя
        const formAddUser = document.createElement('form');
        formAddUser.innerHTML = `<input class="input_id" type="text" placeholder="Введите id">
                                <input class="input_firstName" type="text" placeholder="Введите firstName">
                                <input class="input_lastName" type="text" placeholder="Введите lastName">
                                <input class="input_email" type="text" placeholder="Введите email">
                                <input class="input_phone" type="text" placeholder="Введите phone">
                                <input class="input_user" type="submit" value="добавить позьзователя" disabled>`;
        forms.classList.add('forms');//Присваиваем контейнеру с формами класс из CSS
        forms.style.width = table.offsetWidth + 'px';//Ширина контейнера равна ширине таблицы
        formSearch.classList.add('form');//Присваиваем форме поиска класс из CSS
        formRezet.classList.add('form');//Присваиваем форме сброса класс из CSS
        formAdd.classList.add('form');//Присваиваем форме вызова формы добавления нового пользователя класс из CSS
        formAddUser.style.display = 'none';
        forms.append(formSearch);
        forms.append(formRezet);
        forms.append(formAdd);
        forms.append(formAddUser);
        tableBody.prepend(forms);//Добавлем форму в тело страницы
        const inputValue = tableBody.querySelector('.input_val'); //Поле ввода из формы

        //Поиск
        formSearch.addEventListener('submit', (e) => {
            e.preventDefault();
            //Зачищаем предыдущий вариант сортировки в таблице
            tableBody.querySelectorAll('.cells').forEach(el => {
                el.remove();
            });
            //Удаляем нумерацию страниц
            if (tableBody.querySelector('.num')) {
                tableBody.querySelector('.num').remove();//Удаляем страницы из DOM дерева
                pageNumArr = [];//Удаляем страницы из массива
                }
            conteinerUser.style.transform = 'translateX(0px)';//Перемещаемся на первую страницу таблицы
            //Массив куда записываюся отфильтрованные данные
            let arrObjFilter= arrObj.filter(el => (el.id == inputValue.value.trim())||(el.firstName.toLowerCase() == inputValue.value.toLowerCase().trim())||(el.lastName.toLowerCase() == inputValue.value.toLowerCase().trim())||(el.email == inputValue.value.trim())||(el.phone == inputValue.value.trim()));//trim() - удаляет пробелы спереди и сзади
            console.log(arrObjFilter);
                //Условия вывода данных в таблицу из отфильтрованного массива
            if (arrObjFilter.length >= 1) {
                writingStringTable(arrObjFilter);//Записываем строки в таблицу
                //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
                if (((conteinerUser.scrollWidth)/(tableBody.querySelector('.cells').offsetWidth)) > 1) {
                    writingPageNum();
                }
            } else {
                alert('Ничего не найдено!');
                inputValue.value = '';//Удалеем текст из поля ввода
                writingStringTable(arrObj);//Записываем заново строки в таблицу
                //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
                if (((conteinerUser.scrollWidth)/(tableBody.querySelector('.cells').offsetWidth)) > 1) {
                writingPageNum();
                }
            }
                inputValue.value = '';//Удалеем текст из поля ввода
        });

        //Кнопка сброса поиска
        formRezet.addEventListener('submit', (e) => {
            e.preventDefault();
            //Зачищаем предыдущий вариант сортировки в таблице
            tableBody.querySelectorAll('.cells').forEach(el => {
                el.remove();
            });
            //Удаляем нумерацию страниц
            if (tableBody.querySelector('.num')) {
                tableBody.querySelector('.num').remove();//Удаляем страницы из DOM дерева
                pageNumArr = [];//Удаляем страницы из массива
            }
            inputValue.value = '';//Удалеем текст из поля ввода
            writingStringTable(arrObj);//Записываем строки в таблицу
            
            //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
            if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                writingPageNum();
            }
        });

        //Вывод доп данных пользователя при клике на строку таблицы с пользователем
        const userData = document.createElement('div');//Конейнер куда добавляются доп данные пользователя под таблицей
        userData.style.width = table.offsetWidth + 'px';//Ширина контейнера равна ширине таблицы
        userData.style.margin = '10px auto';//Выравниваем контейнер
        tableBody.append(userData);//Добавляем контейнер в тело страницы
        //Обработчик события клика на строку
        conteinerUser.addEventListener('click', (e) => {
            if (e.target.classList.contains('click_cells')) {
                console.log(e.target.innerHTML);
                const parentCell = e.target.parentNode;
                const cell = {};
                cell.id = parentCell.children[0].innerHTML;
                cell.firstName = parentCell.children[1].innerHTML;
                cell.lastName = parentCell.children[2].innerHTML;
                cell.email = parentCell.children[3].innerHTML;
                cell.phone = parentCell.children[4].innerHTML;
                let clickCells = arrObj.filter(el => (el.id == cell.id)&&(el.firstName == cell.firstName)&&(el.lastName == cell.lastName)&&(el.email == cell.email)&&(el.phone == cell.phone));
                if (clickCells[0].firstName && clickCells[0].description && clickCells[0].address.streetAddress && clickCells[0].address.city && clickCells[0].address.state && clickCells[0].address.zip && clickCells[0].address.zip) {
                    conteinerUser.querySelectorAll('.cells').forEach(el => {
                        el.style.background = '';
                    });
                    parentCell.style.background = 'red';
                    userData.innerHTML = `<p>Выбран пользователь: ${clickCells[0].firstName}</p>
                                            <p>Описание: ${clickCells[0].description}</p>
                                            <p>Адрес проживания: ${clickCells[0].address.streetAddress}</p>
                                            <p>Город: ${clickCells[0].address.city}</p>
                                            <p>Провинция/штат:${clickCells[0].address.state}</p>
                                            <p>Индекс: ${clickCells[0].address.zip}</p>`;
                } else {
                    document.querySelectorAll('.cells').forEach(el => {
                        el.style.background = '';
                    });
                    parentCell.style.background = 'red';
                    userData.innerHTML = '<p>Дополнительные данные отсутствуют</p>';
                }
                const btnClose = document.createElement('button');
                userData.append(btnClose);
                btnClose.innerText = 'закрыть';
                btnClose.addEventListener('click', () => {
                    conteinerUser.querySelectorAll('.cells').forEach(el => {
                        el.style.background = '';
                    });
                    userData.innerHTML = '';
                });
            }
        });

        //Добавление нового пользователя через форму
        formAdd.addEventListener('submit', (e) => {
            e.preventDefault();
            formAddUser.style.display = 'block';
        });

            const inputId = tableBody.querySelector('.input_id');
            const inputFirstname = tableBody.querySelector('.input_firstName');
            const inputLastname = tableBody.querySelector('.input_lastName');
            const inputEmail = tableBody.querySelector('.input_email');
            const inputPhone = tableBody.querySelector('.input_phone');

        formAddUser.addEventListener('mouseout', () => {
            if (inputId.value=='' || inputFirstname.value=='' || inputLastname.value=='' || inputEmail.value=="" || inputPhone.value=="") {
                tableBody.querySelector('.input_user').disabled = true;
            } else {
                tableBody.querySelector('.input_user').disabled = false;
            }
        });
            
        formAddUser.addEventListener('submit', (e) => {
            e.preventDefault();
            const obj = {};
            obj.id = inputId.value;
            obj.firstName = inputFirstname.value;
            obj.lastName = inputLastname.value;
            obj.email = inputEmail.value;
            obj.phone = inputPhone.value;
            arrObj.unshift(obj);
            //Зачищаем предыдущий вариант сортировку в таблице
            tableBody.querySelectorAll('.cells').forEach(el => {
                el.remove();
            });
            //Удаляем нумерацию страниц
            if (tableBody.querySelector('.num')) {
                tableBody.querySelector('.num').remove();//Удаляем страницы из DOM дерева
                pageNumArr = [];//Удаляем страницы из массива
            }
            conteinerUser.style.transform = 'translateX(0px)';//Перемещаемся на первую страницу таблицы
            //Записываем заново вариант сортировки по возрастанию
            writingStringTable(arrObj);//Записываем строки в таблицу
            //Условие при котором если ширина conteinerUser больше ширины строки добавляются цифры переключения страницы
            if (((conteinerUser.scrollWidth)/(document.querySelector('.cells').offsetWidth)) > 1) {
                writingPageNum();
            }
            inputId.value = "";
            inputFirstname.value = "";
            inputLastname.value = "";
            inputEmail.value = "";
            inputPhone.value = "";
        });
            }
}

export default DataTable;