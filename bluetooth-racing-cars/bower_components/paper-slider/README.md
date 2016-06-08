
<!---

This README is automatically generated from the comments in these files:
paper-slider.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

-->

[![Build Status](https://travis-ci.org/PolymerElements/paper-slider.svg?branch=master)](https://travis-ci.org/PolymerElements/paper-slider)

_[Demo and API Docs](https://elements.polymer-project.org/elements/paper-slider)_


##&lt;paper-slider&gt;


Material design: [Sliders](https://www.google.com/design/spec/components/sliders.html)

`paper-slider` allows user to select a value from a range of values by
moving the slider thumb.  The interactive nature of the slider makes it a
great choice for settings that reflect intensity levels, such as volume,
brightness, or color saturation.

Example:

    <paper-slider></paper-slider>

Use `min` and `max` to specify the slider range.  Default is 0 to 100.

Example:

    <paper-slider min="10" max="200" value="110"></paper-slider>

### Styling

The following custom properties and mixins are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--paper-slider-bar-color` | The background color of the slider | `transparent`
`--paper-slider-active-color` | The progress bar color | `--google-blue-700`
`--paper-slider-secondary-color` | The secondary progress bar color | `--google-blue-300`
`--paper-slider-knob-color` | The knob color | `--google-blue-700`
`--paper-slider-disabled-knob-color` | The disabled knob color | `--google-grey-500`
`--paper-slider-pin-color` | The pin color | `--google-blue-700`
`--paper-slider-font-color` | The pin's text color | `#fff`
`--paper-slider-disabled-active-color` | The disabled progress bar color | `--google-grey-500`
`--paper-slider-disabled-secondary-color` | The disabled secondary progress bar color | `--google-grey-300`
`--paper-slider-knob-start-color` | The fill color of the knob at the far left | `transparent`
`--paper-slider-knob-start-border-color` | The border color of the knob at the far left | `#c8c8c8`
`--paper-slider-pin-start-color` | The color of the pin at the far left | `#c8c8c8`
`--paper-slider-height` | Height of the progress bar | `2px`


