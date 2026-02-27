import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientApiService } from '../../services/client-api.service';
import { AppIconComponent } from '../../shared/icon/icon.component';

interface CalDay { date: Date; otherMonth: boolean; events: { label: string; type: 'promo' | 'open' }[]; }

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  current   = new Date();
  today     = new Date();
  weeks: CalDay[][] = [];
  months    = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  weekDays  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  days      = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

  agendaData: any[] = [];
  promoData:  any[] = [];
  upcoming:   any[] = [];
  loading = true;

  selected: CalDay | null = null;
  selectedPromos:    any[] = [];
  selectedBoutiques: any[] = [];

  ngOnInit(): void {
    Promise.all([
      new Promise<void>(res => this.injectedApi.getBoutiquesAgenda().subscribe({ next: d => { this.agendaData = Array.isArray(d) ? d : []; res(); }, error: () => res() })),
      new Promise<void>(res => this.injectedApi.getPromotionsUpcoming().subscribe({ next: d => { this.promoData = Array.isArray(d) ? d : []; this.upcoming = this.promoData.slice(0,8); res(); }, error: () => res() })),
    ]).then(() => { this.loading = false; this.buildCalendar(); });
  }

  constructor(private injectedApi: ClientApiService) {}

  changeMonth(dir: number): void {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() + dir, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year  = this.current.getFullYear();
    const month = this.current.getMonth();
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const startOffset = (first.getDay() + 6) % 7;

    const days: CalDay[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, otherMonth: true, events: [] });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const dt = new Date(year, month, d);
      days.push({ date: dt, otherMonth: false, events: this.eventsForDay(dt) });
    }
    while (days.length % 7 !== 0) {
      const dt = new Date(year, month + 1, days.length - last.getDate() - startOffset + 1);
      days.push({ date: dt, otherMonth: true, events: [] });
    }
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) this.weeks.push(days.slice(i, i + 7));
  }

  eventsForDay(dt: Date): { label: string; type: 'promo' | 'open' }[] {
    const events: { label: string; type: 'promo' | 'open' }[] = [];
    this.promoData.forEach(p => {
      if (p.dateDebut && p.dateFin) {
        const s = new Date(p.dateDebut); const e = new Date(p.dateFin);
        if (dt >= s && dt <= e) events.push({ label: p.titre || p.libelle || 'Promo', type: 'promo' });
      }
    });
    if (this.agendaData.length) events.push({ label: `${this.agendaData.length} boutique${this.agendaData.length > 1 ? 's' : ''}`, type: 'open' });
    return events;
  }

  selectDay(day: CalDay): void {
    if (day.otherMonth) return;
    this.selected = day;
    this.selectedBoutiques = this.agendaData.filter(a => {
      if (!a.dateDebut || !a.dateFin) return true;
      return day.date >= new Date(a.dateDebut) && day.date <= new Date(a.dateFin);
    });
    this.selectedPromos    = this.promoData.filter(p => {
      if (!p.dateDebut || !p.dateFin) return false;
      return day.date >= new Date(p.dateDebut) && day.date <= new Date(p.dateFin);
    });
  }

  isToday(d: Date): boolean { return d.toDateString() === this.today.toDateString(); }
  isSelected(d: Date): boolean { return !!this.selected && d.toDateString() === this.selected.date.toDateString(); }

  get monthLabel(): string { return `${this.months[this.current.getMonth()]} ${this.current.getFullYear()}`; }
  get todayIdx(): number { return (this.today.getDay() + 6) % 7; }

  formatDate(d: string): string { return d ? new Date(d).toLocaleDateString('fr-FR') : ''; }
}
