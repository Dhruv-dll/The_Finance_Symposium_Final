# TFS Events Admin Guide

## How to Manage Events

### Accessing the Admin Panel

1. **Keyboard Shortcut**: Press `Ctrl + Shift + A` on any page to open the admin panel
2. The admin panel will open as an overlay on top of the current page

### Managing Different Types of Events

#### 1. Saturday Sessions

- Add new Saturday seminars/sessions
- Include title and description
- Examples: "Saturday Seminar 3: Crypto Fundamentals", "Data Analytics Workshop"

#### 2. Networking Events

- Add networking events and mixers
- Include title and description
- Examples: "Alumni Mixer 2025", "Industry Connect Session"

#### 3. Flagship Conclave

- Add flagship/major events
- Include title and description
- Examples: "Annual Finance Conclave 2025", "Financial Innovation Summit"

#### 4. Upcoming Events Timeline

- Add future events with full details
- Required fields: Title, Date, Location
- Optional: Time, Description, Days until event (for countdown)
- Examples: New workshops, conferences, seminars

### How It Works

1. **Immediate Updates**: All changes appear instantly on the website
2. **Persistent Storage**: Changes are saved in browser storage and persist between sessions
3. **Popup Integration**: New events automatically appear in navigation dropdowns and event popups
4. **Coming Soon Removal**: When you add the first event to a category, "Coming Soon" is automatically removed

### Event Display Locations

Your events will appear in:

- **Navigation Dropdown**: Saturday Sessions, Networking Events, Flagship Conclave
- **Events Section Cards**: Clickable cards that show event details in popups
- **Upcoming Events Timeline**: Future events with countdown timers

### Data Management Options

For your admin team, you have several approaches:

#### Option 1: Simple Admin Panel (Current)

- **Pros**: Easy to use, no technical knowledge required
- **Cons**: Data stored locally in browser, manual entry
- **Best for**: Small team, infrequent updates

#### Option 2: JSON File Management

- **How**: Edit the `client/data/eventsConfig.json` file
- **Pros**: Version controlled, can be edited by developers
- **Cons**: Requires basic file editing knowledge

#### Option 3: Spreadsheet Integration (Future Enhancement)

- Connect Google Sheets or Excel for bulk management
- Auto-sync events from spreadsheet to website

#### Option 4: Full CMS Integration (Advanced)

- Connect to Strapi, Contentful, or custom backend
- Multiple admin users, approval workflows, media management

### Current Event Categories

1. **Past Events** (Show in popups when clicked):

   - Saturday Sessions
   - Networking Events
   - Flagship Conclave

2. **Upcoming Events** (Show in timeline):
   - Any future events with dates and details

### Tips for Admin Team

1. **Consistent Naming**: Use clear, descriptive titles
2. **Regular Updates**: Add events as they're planned
3. **Backup Data**: Periodically export your events configuration
4. **Team Coordination**: Decide who has admin access to avoid conflicts

### Technical Notes

- Changes are saved in browser `localStorage`
- Data persists until browser storage is cleared
- Each browser/device needs to be updated separately (unless using shared backend)
- For team usage, consider implementing a shared database solution

### Support

If you need additional features or encounter issues:

1. The admin panel provides immediate feedback
2. All changes are reversible by editing the configuration
3. Contact your development team for advanced features

---

**Quick Start**: Press `Ctrl + Shift + A` → Add your events → They appear immediately!
