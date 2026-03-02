import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/** Maps category names (as stored in DB) to Lucide icon names */
const CAT_ICON: Record<string, string> = {
  // Vêtements / Mode
  'Mode': 'shirt', 'Vêtements': 'shirt',
  // Chaussures
  'Chaussures': 'footprints',
  // Électronique
  'Électronique': 'smartphone',
  // Beauté
  'Beauté': 'sparkles', 'Beauté / Soins': 'sparkles', 'Soins': 'sparkles',
  // Sport
  'Sport': 'dumbbell',
  // Bijoux
  'Bijoux': 'gem',
  // Livres / Librairie
  'Livres': 'book-open', 'Librairie': 'book-open',
  // Restauration générale
  'Restaurant': 'utensils', 'Restauration': 'utensils', 'Fast Food': 'utensils',
  // Café
  'Café': 'coffee',
  // Alimentation spécifique
  'Pizza': 'pizza',
  'Sushi': 'fish',
  'Glaces': 'ice-cream-cone',
  'Sandwichs': 'sandwich',
  'Tacos': 'utensils',
  'Desserts': 'cake-slice',
  'Boulangerie': 'wheat',
  'Burger': 'utensils',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <lucide-icon
      [name]="iconName"
      [size]="size"
      [color]="color"
      [strokeWidth]="strokeWidth"
      [style.display]="'flex'"
    />
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; }'],
})
export class AppIconComponent {
  /** Category name from DB — auto-mapped to the right icon */
  @Input() cat?: string;
  /** Direct Lucide icon name (kebab-case) e.g. "clock", "shopping-bag" */
  @Input() name?: string;
  @Input() size: number = 20;
  @Input() color: string = 'currentColor';
  @Input() strokeWidth: number = 1.75;

  get iconName(): string {
    if (this.name) return this.name;
    if (this.cat) return CAT_ICON[this.cat] ?? 'store';
    return 'store';
  }
}
