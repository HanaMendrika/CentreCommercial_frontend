// app.config.ts
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  Activity, BookOpen, CakeSlice, Car, Clock, Coffee, Dumbbell,
  FileText, Fish, Footprints, Gem, Gift, Globe, IceCreamCone,
  Inbox, Lock, MapPin, MessageCircle, Moon, Package, Pizza,
  Sandwich, Search, ShoppingBag, Shirt, Smartphone, Sparkles,
  SquareParking, Star, Store, Tag, Utensils, Wheat,
  Calendar, ChevronRight, ChevronLeft, Plus, X, Check,
  AlertCircle, Info, ArrowRight, Filter, LayoutGrid,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({
      Activity, BookOpen, CakeSlice, Car, Clock, Coffee, Dumbbell,
      FileText, Fish, Footprints, Gem, Gift, Globe, IceCreamCone,
      Inbox, Lock, MapPin, MessageCircle, Moon, Package, Pizza,
      Sandwich, Search, ShoppingBag, Shirt, Smartphone, Sparkles,
      SquareParking, Star, Store, Tag, Utensils, Wheat,
      Calendar, ChevronRight, ChevronLeft, Plus, X, Check,
      AlertCircle, Info, ArrowRight, Filter, LayoutGrid,
    })),
  ]
};