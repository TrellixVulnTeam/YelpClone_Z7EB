import { removeSelectedFilter, removeSelectedFilterRestaurant } from './addClickHandlers'
export const Autocomplete = (selector, data) => {
    let inputs = document.querySelectorAll(selector);

    function ciSearch(what = '', where = '') {
        return where.toUpperCase().search(what.toUpperCase());
    }

    inputs.forEach(input => {

        input.classList.add('autocomplete-input');
        let wrap = document.createElement('div');
        wrap.className = 'autocomplete-wrap';
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);

        let list = document.createElement('div');
        list.className = 'autocomplete-list';
        wrap.appendChild(list);

        let matches = [];
        let listItems = [];
        let focusedItem = -1;

        function setActive(active = true) {
            if (active)
                wrap.classList.add('active');
            else
                wrap.classList.remove('active');
        }

        function focusItem(index) {
            if (!listItems.length) return false;
            if (index > listItems.length - 1) return focusItem(0);
            if (index < 0) return focusItem(listItems.length - 1);
            focusedItem = index;
            unfocusAllItems();
            listItems[focusedItem].classList.add('focused');
        }

        function unfocusAllItems() {
            listItems.forEach(item => {
                item.classList.remove('focused');
            });
        }

        function selectItem(index) {
            if (!listItems[index]) return false;
            input.value = listItems[index].innerText;
            setActive(false);
        }

        function handleInput() {
            removeSelectedFilter()
            removeSelectedFilterRestaurant()
            document.querySelectorAll('.cards_wrapper_restaurants>a>div').forEach(item => {
                item.classList.remove('hidden_card');
            })
            document.querySelectorAll('.cards_wrapper_restaurants>a').forEach(item => {
                item.classList.remove('hidden');
            })
            let value = input.value;

            if (!value) {
                focusedItem = -1
                return setActive(false);
            }

            list.innerHTML = '';
            listItems = [];
            data.forEach((dataItem, index) => {
                let search = ciSearch(value, dataItem);
                if (search === -1) {

                    return false;
                }
                matches.push(index);

                let parts = [
                    dataItem.substr(0, search),
                    dataItem.substr(search, value.length),
                    dataItem.substr(search + value.length, dataItem.length - search - value.length)
                ];
                let item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = parts[0] + '<strong>' + parts[1] + '</strong>' + parts[2];
                list.appendChild(item);
                listItems.push(item);
                item.addEventListener('click', function() {
                    selectItem(listItems.indexOf(item));
                    searchNameRestaurant();
                });

            });

            if (listItems.length > 0) {
                focusItem(0);
                setActive(true);
            } else setActive(false);
        }

        input.removeEventListener('input', handleInput, true);
        input.addEventListener('input', handleInput, true);
        input.addEventListener('keydown', e => {
            removeSelectedFilter()
            removeSelectedFilterRestaurant()

            let keyCode = e.keyCode;

            if (keyCode === 40) { // arrow down
                e.preventDefault();
                focusedItem++;
                focusItem(focusedItem);
            } else if (keyCode === 38) { //arrow up
                e.preventDefault();
                if (focusedItem > 0) focusedItem--;
                focusItem(focusedItem);
            } else if (keyCode === 27) { // escape
                setActive(false);
            } else if (keyCode === 13) { // enter
                selectItem(focusedItem);
                searchNameRestaurant()
                if (input.value === '') {
                    listItems = [];
                    focusedItem = -1;
                }
            }
        });
        input.addEventListener('click', (e) => {
            input.value = '';



        })

        function searchNameRestaurant() {
            let nameRestaurant = document.querySelectorAll('.title_card')
            let card = document.querySelectorAll('.cards_wrapper_restaurants>a')
            card.forEach(nameRestaurant => {
                nameRestaurant.classList.remove('hidden');
            })

            if (nameRestaurant) {
                if (input.value !== '') {
                    card.forEach(nameRestaurant => {

                        if (nameRestaurant.innerText.search(input.value) === -1) {
                            nameRestaurant.classList.add('hidden');
                        } else {
                            nameRestaurant.classList.remove('hidden');
                        }
                    })
                } else {
                    card.forEach(nameRestaurant => {
                        nameRestaurant.classList.remove('hidden');
                    })
                }
            }
        }
        document.body.addEventListener('click', function(e) {
            if (!wrap.contains(e.target)) setActive(false);
            listItems = [];
            focusedItem = -1;
        });
    })
    let select = document.querySelector('.searching_city ')
    if (select) {
        select.addEventListener('click', () => {
            let inputSelect = document.querySelector('#input-select')
            if (inputSelect) {
                inputSelect.value = ''
            }
        })
    }
}