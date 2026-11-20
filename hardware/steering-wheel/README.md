# Steering wheel with screen opening and rear access plate

`max_verstappen_steering_wheel_screen_window.3mf` is the "Max Verstappen Steering Wheel F1" model
(by marconooren on MakerWorld) with the printed dashboard face removed and room for the Guition
JC3248W535 module. Paint colours on the rest of the wheel are kept. Not opened in Bambu Studio yet,
and still an X1 Carbon project (re-slice for P1S).

`screen_access_plate_print.stl` is the separate rear plate, oriented rear face down for printing.
`screen_access_plate_assembled.stl` is the same part in its place on the wheel (for fit checks).

## Dimensions come from the module measurements

Module 94.5 x 62.0 mm, 12.3 mm thick (4.9 mm at the screen edge), four M2.5 brass inserts on an
85.84 x 53.77 mm pattern (centres), stock screw head 8.71 mm, 2.9 mm clearance hole.

## What was cut (wheel-model mm, front is the -y side)

- Window through the face: 90.4 x 51.0 (the old recessed dashboard panel).
- Module pocket: 95.0 x 62.6, from a ~5 mm front lip all the way out the back. Behind the lower half of
  the screen the wheel is about 16 mm thick, so the pocket cuts through it and opens at the very back.
  Pocket centre is 40.0 mm above the wheel origin.
- LED dots: 17 holes of 4.0 mm (top row) and 3 + 3 holes of 2.6 mm (sides) go from the front into
  LED strip channels cut from the back: a 6 mm wide channel along the top row and a 5.9 mm wide
  channel beside each side column (starting at z = 53 to keep clear of the USB-C tunnel). 16 mm of body is left in front of the channels.
- Plate seats: two small seats on each side for the plate ears, with four M3 heat-set insert holes
  (4.2 mm, 6 mm deep) at x = +/-51.3, z = 14 and 32.

## Access plate

Stepped plate that closes the rear: a thick lower block that ends flush with the wheel's back, a
thin upper cover, and side ears. Four 7 mm posts reach forward to the module's corner tabs, so the
four M2.5 screws go in from the back through the plate and posts into the module's inserts.

- Module screws: M2.5 x 14 mm, 9.4 mm screwdriver wells, 2.9 mm holes.
- Plate screws: 4 x M3 x 10 mm into heat-set inserts in the wheel.
- The posts assume the module's corner tabs are 4.9 mm thick (the thickness at the screen edge).
  Check the fit with a test print before printing the whole wheel.
- USB-C power: a 13.6 x 9.6 mm tunnel runs from the module's port out through the left side of the wheel
  (left when viewed from the front). The port position comes from the module measurements: 7.4 mm above the
  screen centre and 6.15 mm behind the glass. The TF slot has no opening (not hot-swapped).
