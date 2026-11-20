# Steering wheel screen area

`max_verstappen_steering_wheel_screen_blocker.3mf` is the "Max Verstappen Steering Wheel F1" model
(by marconooren on MakerWorld) with one change: the `Algemeen-Kubus` support blocker inside the wheel
body is resized to the screen area. Nothing else in the project was touched, and it has not been
opened in Bambu Studio yet. The original project is still an X1 Carbon project.

## Screen area (measured from the mesh)

| | Wheel-model mm | In the slicer (x0.95 object scale) |
| --- | --- | --- |
| Width, first dot edge to last dot edge | 90.0 | 85.5 |
| Height, bottom of dots to 1 mm below the SPEED label | 58.75 | 55.8 |
| Centred left to right, centre height above wheel origin | 46.1 | 43.8 |

- The top edge is the lowest point of the dot row (the row is slightly arched).
- The blocker depth was left as it was.
- The blocker only controls where supports go. The face is still a solid recessed plate, so the
  window for the display has to be cut separately.

## Display notes

The Guition JC3248W535 has a 73.4 x 49.0 mm visible area and a 94.5 x 62.0 mm module, so it sits
behind the face with about 6 mm of border left and right and 3 mm top and bottom.
