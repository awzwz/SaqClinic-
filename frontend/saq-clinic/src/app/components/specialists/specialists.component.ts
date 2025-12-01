import { Component } from '@angular/core';

interface Specialist {
    name: string;
    role: string;
    description: string;
    image: string;
}

@Component({
    selector: 'app-specialists',
    templateUrl: './specialists.component.html',
    styleUrls: ['./specialists.component.scss']
})
export class SpecialistsComponent {
    specialists: Specialist[] = [
        {
            name: 'Жанна Бауржановна',
            role: 'Анестезиолог-реаниматолог, врач-дерматокосметолог, пластический хирург, директор клиники SAQ',
            description: 'Врач с 15-летним опытом. Параллельно училась и работала медсестрой. В 2009 году окончила КГМУ (лечебное дело), прошла интернатуру по хирургии. Обучает специалистов современным методам косметологии и сочетает в работе медицинскую точность и эстетический подход.',
            image: 'assets/images/specialists/zhanna.jpg'
        },
        {
            name: 'Альмира Болатовна',
            role: 'Врач дерматокосметолог',
            description: 'Медицинский стаж с 2005 года. Дерматолог с 2020 года. 2005 Окончила медицинский университет Астана по специальности терапия. Переподготовка по дерматологии в 2020.',
            image: 'assets/images/specialists/almira.jpg'
        },
        {
            name: 'Сыздыкова Кызгалдак Бакытбековна',
            role: 'Врач косметолог',
            description: 'Училась в Карагандинском медицинском университете, факультет общая врачебная практика. В косметологии с 2018 года. Два года работала в поликлинике врачом общей практики.',
            image: 'assets/images/specialists/kyzgaldak.jpg'
        },
        {
            name: 'Смагулова Камила',
            role: 'Косметолог Эстет',
            description: '10 лет в сфере косметологии. Академия Germainde de Capuccini.',
            image: 'assets/images/specialists/kamila.jpg'
        }
    ];
}
