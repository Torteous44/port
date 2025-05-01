# Basic Card Component

A simple, reusable card component that can display an image, title, and description.

## Usage

```tsx
import BasicCard from './BasicCard';

// Basic usage
<BasicCard 
  title="Card Title"
  description="This is a description of the card content."
/>

// With image
<BasicCard 
  title="Card with Image"
  description="This card includes an image."
  imageUrl="path/to/image.jpg"
/>

// With click handler
<BasicCard 
  title="Clickable Card"
  description="This card can be clicked."
  onClick={() => console.log('Card clicked!')}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | The title of the card |
| description | string | Yes | The description text |
| imageUrl | string | No | URL of the image to display |
| onClick | function | No | Callback function when card is clicked | 