# Game Mechanics Design - Canvas Course World

## Core Concept: Old Timey Town Square Interface

Transform Canvas course navigation into an interactive 2D town where students explore buildings to access course features.

## World Layout

### Main Town Square (Central Hub)
- **Visual**: Old western/colonial town square with cobblestones
- **Function**: Central navigation hub, player spawn point
- **Interactive Elements**:
  - Bulletin board (announcements)
  - Town well or fountain (social gathering spot)
  - Horse hitching post (quick navigation)

### Core Buildings (Canvas Navigation)

#### 1. **Assignment Hall** 🏛️
- **Building Type**: Grand courthouse/city hall
- **Canvas Equivalent**: Assignments
- **Mechanics**:
  - Approaching building shows assignment list overlay
  - Completed assignments = green checkmarks on building
  - Overdue assignments = red flags/notices
  - New assignments = glowing windows or posted notices

#### 2. **Discussion Tavern** 🍺
- **Building Type**: Saloon/tavern with swinging doors
- **Canvas Equivalent**: Discussions
- **Mechanics**:
  - Activity level = crowd noise/light from windows
  - New posts = people walking in/out
  - Unread discussions = mail carrier outside
  - Popular discussions = busier entrance

#### 3. **Learning Library** 📚
- **Building Type**: Large library/academy
- **Canvas Equivalent**: Modules
- **Mechanics**:
  - Progress through modules = lighting up floors/wings
  - Current module = open book icon above door
  - Locked modules = chained sections
  - Completed modules = academic banners

#### 4. **Grade House** 📊
- **Building Type**: Bank/accounting office
- **Canvas Equivalent**: Grades
- **Mechanics**:
  - Recent grade changes = activity around building
  - Good grades = positive decorations (flags, flowers)
  - Needs improvement = concern indicators

### Side Streets & Secondary Areas

#### **Collaboration Corner**
- **Canvas Equivalent**: Groups, People, Collaborations
- **Visual**: Smaller buildings down a side street
- **Mechanics**: Group project houses, team meeting spots

#### **Resource Row**
- **Canvas Equivalent**: Files, Syllabus, External Tools
- **Visual**: Shop fronts and service buildings
- **Mechanics**: Blacksmith (tools), General Store (files), Post Office (external links)

#### **Achievement Avenue**
- **Canvas Equivalent**: Custom progress tracking
- **Visual**: Hall of Fame, Trophy Shop
- **Mechanics**: Display completed quests, badges, milestones

## Core Game Mechanics

### Navigation & Movement
- **2D Top-down Movement**: Arrow keys or WASD
- **Click-to-Move**: Mouse click movement option
- **Building Interaction**: 
  - Walk up to building → Show interaction prompt
  - Press E or click → Open Canvas feature in overlay/modal
  - Or seamlessly transition to Canvas page

### Progress Visualization
- **Completion Status**: Buildings change appearance based on student progress
- **Activity Indicators**: Visual cues for new content, deadlines, activity levels
- **Personal Progress**: Player avatar customization based on achievements

### Social Elements
- **Other Players**: See other students as avatars moving around town
- **Activity Hotspots**: Popular buildings show more activity
- **Collaborative Spaces**: Special areas for group work

### Notification System
- **Mail Carrier NPC**: Delivers notifications about new assignments, grades, discussions
- **Town Crier**: Announces course-wide updates
- **Building Alerts**: Visual indicators (smoke, lights, flags) for attention-needed items

## Educational Alignment

### Learning Objectives Integration
- **Quest System**: Transform assignments into quests with clear objectives
- **Progress Tracking**: Visual representation of learning journey
- **Achievement System**: Recognize different types of learning milestones
- **Social Learning**: Encourage collaboration through shared spaces

### Engagement Mechanics
- **Exploration Rewards**: Hidden areas with bonus content or easter eggs
- **Seasonal Events**: Town changes with academic calendar (exams = storm clouds)
- **Customization**: Earn building decorations or avatar items through course participation

## Technical Implementation Notes

### Phaser.js Integration
- **Scene Management**: Main town scene with building interaction zones
- **Sprite Management**: Character avatars, building states, environmental objects
- **Input Handling**: Keyboard movement, mouse interactions, building triggers

### Canvas API Integration
- **Real-time Data**: Pull assignment counts, due dates, discussion activity
- **Permission-based Display**: Different views for students vs. teachers
- **Navigation Bridge**: Smooth transition between game and Canvas pages

### State Management
- **Player Position**: Remember last location in town
- **Building States**: Cache Canvas data for visual indicators
- **Progress Tracking**: Store exploration and interaction history

## Teacher/Admin View

### Course Management Interface
- **Town Planning**: Configure building layouts and appearances
- **Activity Monitoring**: Heat maps of student engagement areas
- **Custom Quests**: Create special assignments with game mechanics
- **Analytics Dashboard**: Track navigation patterns and engagement

## Next Steps
1. Create detailed building interaction flows
2. Define data requirements for visual indicators
3. Plan avatar/character customization system
4. Design notification and alert systems