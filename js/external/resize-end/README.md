# Resize End

Listening to the ```resize``` event can be expensive as it fires every single time the viewport changes. Using the Resize End plugin can prevent thrashing by firing just one event, ```resizeend```, when the user has stopped resizing.

## Install

### File include

Download the latest resize-end.min.js from http://github.com/InventingWithMonster/resize-end and include it in your HTML document with a script tag, ie:

```html
<script src="/path/to/resize-end.min.js"></script>
```

### NPM (recommended)

First install Resize End in your project root.

```  
$ npm install resize-end
```

Then include in your project using require().

```javascript
require('resize-end');
```

## Use

Simply replace your ```resize``` event listeners with ```resizeend```:

```javascript
$(window).on('resizeend', function () {
    // your callback
});

window.addEventListener('resizeend', function () {
    // your callback
});
```