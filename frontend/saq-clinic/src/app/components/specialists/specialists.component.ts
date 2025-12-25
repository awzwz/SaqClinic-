import { Component } from '@angular/core';

interface Specialist {
    name: string;
    role: string;
    description: string;
    image: string;
    helpsWith: string[];
    reviewsCount?: number;
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
            description: 'Врач с 15-летним опытом. В 2009 году окончила КГМУ (лечебное дело), прошла интернатуру по хирургии.',
            image: 'assets/images/specialists/zhanna.jpg',
            helpsWith: [
                'Провести комплексную диагностику кожи',
                'Подобрать индивидуальный план омоложения',
                'Выполнить инъекционные процедуры',
                'Консультация по пластической хирургии'
            ],
            reviewsCount: 87
        },
        {
            name: 'Альмира Болатовна',
            role: 'Врач дерматокосметолог',
            description: 'Медицинский стаж с 2005 года. Дерматолог с 2020 года. Окончила медицинский университет Астана.',
            image: 'assets/images/specialists/almira.jpg',
            helpsWith: [
                'Лечение акне и постакне',
                'Аппаратная косметология',
                'Пилинги и чистки лица',
                'Уход за проблемной кожей'
            ],
            reviewsCount: 64
        },
        {
            name: 'Сыздыкова Кызгалдак Бакытбековна',
            role: 'Врач косметолог',
            description: 'Окончила Карагандинский медицинский университет. В косметологии с 2018 года.',
            image: 'assets/images/specialists/kyzgaldak.jpg',
            helpsWith: [
                'Мезотерапия и биоревитализация',
                'Контурная пластика',
                'Уходовые процедуры',
                'Восстановление кожи'
            ],
            reviewsCount: 52
        },
        {
            name: 'Смагулова Камила',
            role: 'Косметолог Эстет',
            description: '10 лет в сфере косметологии. Академия Germaine de Capuccini.',
            image: 'assets/images/specialists/kamila.jpg',
            helpsWith: [
                'SPA-процедуры для лица и тела',
                'Массаж лица',
                'Оздоровительные капельницы',
                'Подбор домашнего ухода'
            ],
            reviewsCount: 41
        }
    ];
}
