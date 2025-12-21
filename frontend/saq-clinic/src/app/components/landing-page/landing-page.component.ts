import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ApiService, ContactSubmission } from '../../services/api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  contactForm: FormGroup;
  isSubmitting = false;
  submissionSuccess: boolean | null = null;
  readonly services = [
    {
      title: 'Аппаратная косметология',
      description: 'SMAS-лифтинг, лазерное омоложение, микротоковая терапия и другие процедуры на премиальном оборудовании.'
    },
    {
      title: 'Инъекционные методики',
      description: 'Ботулинотерапия, контурная пластика, биоревитализация с авторскими протоколами врачей-экспертов.'
    },
    {
      title: 'Уходовые ритуалы',
      description: 'Комбинированные программы для лица и тела, направленные на сияние кожи и баланс организма.'
    },
    {
      title: 'Пластическая хирургия',
      description: 'Современные методы пластической хирургии для коррекции и улучшения внешности от ведущих специалистов.'
    }
  ];

  readonly educationPrograms = [
    {
      title: 'Базовый курс косметолога',
      duration: '6 недель',
      description: 'Фундаментальная подготовка для начинающих специалистов с упором на практику и безопасность.'
    },
    {
      title: 'Продвинутая эстетика',
      duration: '4 недели',
      description: 'Современные инъекционные техники, anti-age стратегии и работа с сложными случаями.'
    },
    {
      title: 'Аппаратные методики',
      duration: '3 недели',
      description: 'Освоение работы с топовыми устройствами: лазеры, RF-лифтинг, SMAS и LPG.'
    }
  ];

  readonly shopCollections = [
    {
      title: 'Профессиональные пилинги',
      description: 'Клинические составы для обновления кожи с контролируемой глубиной воздействия.'
    },
    {
      title: 'Домашний уход',
      description: 'Система поддерживающих средств, подобранных под тип и задачи вашей кожи.'
    },
    {
      title: 'Инструменты и расходники',
      description: 'Премиальные материалы для косметологов: иглы, маски, аксессуары и защитные средства.'
    }
  ];

  private readonly destroy$ = new Subject<void>();

  readonly experienceImages = [
    'assets/images/experience/exterior.jpg',
    'assets/images/experience/interior.jpg'
  ];
  currentExperienceImageIndex = 0;
  private carouselInterval: any;

  @ViewChild('servicesCarousel') servicesCarousel!: ElementRef;
  servicesScrollPosition = 0;

  constructor(private readonly fb: FormBuilder, private readonly apiService: ApiService) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-()\s]{6,}$/)]],
      email: ['', [Validators.email]],
      preferredService: ['', Validators.required],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.startCarousel();
  }

  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submissionSuccess = null;

    this.apiService
      .submitInquiry(this.contactForm.value as ContactSubmission)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: () => {
          this.submissionSuccess = true;
          this.contactForm.reset();
        },
        error: () => {
          this.submissionSuccess = false;
        }
      });
  }

  selectServiceAndScroll(serviceTitle: string): void {
    this.contactForm.patchValue({ preferredService: serviceTitle });
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollServices(direction: 'left' | 'right'): void {
    if (this.servicesCarousel) {
      const container = this.servicesCarousel.nativeElement;
      const cardWidth = container.querySelector('.service-card-new')?.offsetWidth || 340;
      const scrollAmount = cardWidth + 24; // card width + gap

      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
      this.servicesScrollPosition = container.scrollLeft;
    }
  }

  private startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.currentExperienceImageIndex = (this.currentExperienceImageIndex + 1) % this.experienceImages.length;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
}
