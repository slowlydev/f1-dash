# Steering wheel with screen opening

`max_verstappen_steering_wheel_screen_window.3mf` is the "Max Verstappen Steering Wheel F1" model
(by marconooren on MakerWorld) with the printed dashboard face removed and a pocket for the Guition
JC3248W535 module. Paint colours on the rest of the wheel are kept. Not yet opened in Bambu Studio,
and still an X1 Carbon project (re-slice for P1S).

## What was cut (wheel-model mm, front is the -y side)

- Window through the face: 90.4 x 51.0 (the exact recessed dashboard panel; 1.6 mm below the bezel).
- Rear pocket: 95.0 x 62.6, from the back face forward to 5 mm behind the front plane of the panel,
  leaving a ~5 mm front lip that the module's glass sits against. Pocket is centred on the window.
- The old `Algemeen-Kubus` support blocker is removed, so slicer supports are generated for the
  roof of the window and pocket.

## Module

94.5 x 62.0 mm front glass, 73.4 x 49.0 mm active area, four threaded brass inserts in the corner
tabs on the back. Screw hole positions are not in this file yet.
