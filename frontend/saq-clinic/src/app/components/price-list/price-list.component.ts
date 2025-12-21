import { Component } from '@angular/core';

interface PriceItem {
    name: string;
    price?: string;
    priceMen?: string;
    priceWomen?: string;
    isHeader?: boolean;
}

interface PriceCategory {
    id: string;
    title: string;
    items: PriceItem[];
    isLaser?: boolean; // Special layout for laser hair removal
}

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styleUrls: ['./price-list.component.scss']
})
export class PriceListComponent {
    categories: PriceCategory[] = [
        {
            id: 'laser',
            title: 'Лазерное удаление волос',
            isLaser: true,
            items: [
                { name: 'Отдельные зоны', isHeader: true },
                { name: 'Глубокое бикини', priceWomen: '12.000', priceMen: '16.000' },
                { name: 'Подмышечные впадины', priceWomen: '5.000', priceMen: '9.000' },
                { name: 'Усики', priceWomen: '2.000', priceMen: '5.000' },
                { name: 'Руки до локтя', priceWomen: '10.000', priceMen: '13.000' },
                { name: 'Руки полностью', priceWomen: '12.000', priceMen: '16.000' },
                { name: 'Ноги до колен', priceWomen: '12.000', priceMen: '15.000' },
                { name: 'Ноги полностью', priceWomen: '18.000', priceMen: '23.000' },
                { name: 'Все тело', priceWomen: '33.000', priceMen: '38.000' },
                { name: 'Ягодицы', priceWomen: '8.000', priceMen: '8.000' },
                { name: 'СЭТЫ', isHeader: true },
                { name: 'Глубокое бикини + подмышки', priceWomen: '15.000', priceMen: '18.000' },
                { name: 'Глубокое бикини + подмышки + ноги до колен', priceWomen: '18.000', priceMen: '22.000' },
                { name: 'Глубокое бикини + подмышки + ноги полностью', priceWomen: '22.000', priceMen: '26.000' },
                { name: 'Глубокое бикини + подмышки + руки до локтя', priceWomen: '22.000', priceMen: '30.000' },
                { name: 'Подмышки + руки до локтя + ноги полностью', priceWomen: '28.000', priceMen: '33.000' },
                { name: 'Подмышки + глубокое бикини + руки полностью + ноги полностью', priceWomen: '25.000', priceMen: '33.000' },
            ]
        },
        {
            id: 'cosmetology',
            title: 'Косметология и Уход',
            items: [
                { name: 'Аппаратная косметология', isHeader: true },
                { name: 'РФ-игольчатый (лицо)', price: '45.000' },
                { name: 'РФ-игольчатый (лицо + шея)', price: '90.000' },
                { name: 'SMAS-лифтинг (лицо + шея)', price: '95.000' },
                { name: 'Лазерная CO2-шлифовка', price: '100.000' },

                { name: 'Мезо и уходовые процедуры', isHeader: true },
                { name: 'Мезотерапия (лицо/руки/шея): Корея', price: 'от 18.000' },
                { name: 'Мезотерапия (лицо/руки/шея): Европа', price: 'от 25.000' },
                { name: 'Биоревитализация (Хуарон)', price: 'от 20.000' },
                { name: 'ПДРН-терапия 2 мл Корея', price: 'от 50.000' },
                { name: 'Мезонить (1 мононить)', price: '4.000' },
                { name: 'Жидкие нити', price: 'от 85.000' },
                { name: 'Полимолочная кислота (200 мг)', price: 'от 190.000' },
                { name: 'Коллагеностимуляция', price: 'от 100.000' },
                { name: 'Плазмотерапия Cortexil PRP (1 пробирка)', price: '55.000' },
                { name: 'Биоплазма', price: '50.000' },
                { name: 'Сосудистый запуск', price: 'от 25.000' },
                { name: 'Плазмотерапия (1 пробирка)', price: '25.000' },

                { name: 'Косметология (эстет)', isHeader: true },
                { name: 'Чистка лица комбинированная (аппаратная + механическая)', price: '35.000' },
                { name: 'Чистка лица + поверхностный пилинг', price: '35.000' },
                { name: 'РФ-лифтинг, микротоки, миостимуляция (15 мин)', price: 'от 20.000' },
                { name: 'Пилинг PRX-T33 + чистка лица', price: '55.000' },
                { name: 'Дарсонваль (лицо / волосы)', price: '10.000' },
                { name: 'Срединный пилинг', price: '15.000' },
                { name: 'Желтый пилинг', price: '45.000' },
                { name: 'Фракционная мезотерапия', price: '25.000' },
                { name: 'Мужская чистка лица', price: '40.000' },
                { name: 'Мужская чистка лица + пилинг', price: '55.000' },
                { name: 'Мужская чистка лица + мезотерапия', price: '55.000' },
            ]
        },
        {
            id: 'injections',
            title: 'Инъекционные процедуры',
            items: [
                { name: 'Инъекции и капельницы', isHeader: true },
                { name: 'Инъекция (в/м) внутримышечно', price: '1.000' },
                { name: 'Инъекция (в/в) внутривенно', price: '1.500' },
                { name: 'Капельница (в/в) внутривенно', price: 'от 2.000' },

                { name: 'Витаминные капельницы', isHeader: true },
                { name: 'Золушка', price: '25.000' },
                { name: 'Мужское здоровье', price: '25.000' },
                { name: 'Чесночная', price: '20.000' },
                { name: 'Похудей-ка', price: '25.000' },
                { name: 'Железо', price: '20.000' },
                { name: 'Мультивитаминная', price: '23.000' },
                { name: 'Мелсмен', price: '20.000' },
                { name: 'Лаеннек', price: '25.000' },

                { name: 'Контурная пластика (Филлеры)', isHeader: true },
                { name: 'Увеличение губ', price: 'от 50.000' },
                { name: 'E.P.T.Q. (Корея)', price: '65.500' },
                { name: 'Elaxfill (Корея)', price: '59.500' },
                { name: 'Regenyal (Италия)', price: '80.000' },
                { name: 'Teosyal (Швейцария)', price: '135.000' },
                { name: 'Juvederm (Франция) 1 мл.', price: '155.000' },
                { name: 'Juvederm (Франция) 0.5 мл.', price: '105.000' },
            ]
        },
        {
            id: 'intimate',
            title: 'Интимное омоложение',
            items: [
                { name: 'Интимное гинекологическое омоложение', isHeader: true },
                { name: 'Гинекологический SMAS', price: '45.000' },
                { name: 'Лазерная шлифовка (вагинальная)', price: '45.000' },
                { name: 'Лазерная шлифовка (вагинальная + половые губы)', price: '65.000' },
                { name: 'Плазмотерапия', price: 'от 45.000' },
                { name: 'Интимный пилинг (осветление)', price: 'от 30.000' },
                { name: 'Увеличение половых губ', price: 'от 80.000' },

                { name: 'Интимное мужское омоложение', isHeader: true },
                { name: 'Увеличение пениса Филлерами', price: 'от 120.000' },
                { name: 'Полимолочная кислота', price: 'от 220.000' },
            ]
        },
        {
            id: 'other',
            title: 'Другие процедуры',
            items: [
                { name: 'Неинъекционные процедуры', isHeader: true },
                { name: 'Массаж лица (10 сеансов)', price: '250.000' },
                { name: 'Пилинг RTX-T33', price: '40.000' },

                { name: 'Удаление', isHeader: true },
                { name: 'Тату и татуажа', price: 'от 10.000' },
                { name: 'Папиллом (бородавка)', price: 'от 1.000' },

                { name: 'ELOS - Лечение', isHeader: true },
                { name: 'Акне', price: 'от 35.000' },
                { name: 'Купероз, пигментация', price: 'от 35.000' },
                { name: 'Карбоновый пилинг', price: '25.000' },
            ]
        }
    ];

    activeCategory = 'laser';

    setActiveCategory(id: string): void {
        this.activeCategory = id;
    }
}
