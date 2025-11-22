import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ApiService, ContactSubmission } from '../../services/api.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnDestroy {
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

  constructor(private readonly fb: FormBuilder, private readonly apiService: ApiService) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-()\s]{6,}$/)]],
      email: ['', [Validators.email]],
      preferredService: ['', Validators.required],
      message: ['']
    });
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
