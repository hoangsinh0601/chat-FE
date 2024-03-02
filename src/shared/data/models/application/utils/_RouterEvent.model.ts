import {
  ActivationEnd,
  ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  RoutesRecognized,
  Scroll,
} from '@angular/router';

export type RouterEvent =
  | NavigationStart
  | NavigationEnd
  | NavigationCancel
  | NavigationError
  | NavigationSkipped
  | GuardsCheckStart
  | GuardsCheckEnd
  | ChildActivationStart
  | ChildActivationEnd
  | ActivationStart
  | ActivationEnd
  | ResolveStart
  | ResolveEnd
  | RoutesRecognized
  | RouteConfigLoadStart
  | RouteConfigLoadEnd
  | Scroll;
