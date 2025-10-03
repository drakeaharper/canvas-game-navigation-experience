# Canvas Course World - Town Layout Diagram

## Main Town Square Layout (ASCII)

```
                    CANVAS COURSE WORLD TOWN
                         (Old Timey Theme)

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  Achievement Ave    Resource Row                                │
    │  ┌──────────────┐  ┌──────────────┐                           │
    │  │ Hall of Fame │  │ General Store│                           │
    │  │     🏆       │  │    Files     │                           │
    │  └──────────────┘  │     📁       │                           │
    │  ┌──────────────┐  └──────────────┘                           │
    │  │ Trophy Shop  │  ┌──────────────┐                           │
    │  │    Badges    │  │  Post Office │                           │
    │  │     🎖️       │  │ Ext. Tools   │                           │
    │  └──────────────┘  │     📮       │                           │
    │       │ │           └──────────────┘                           │
    │       │ │                │ │                                   │
    │       │ │                │ │                                   │
    │  ─────┘ └────────────────┘ └─────────────                     │
    │                                       │                       │
    │                                       │                       │
    │    ┌───────────────┐                 │    ┌───────────────┐   │
    │    │ Learning      │                 │    │  Discussion   │   │
    │    │  Library      │    Town Square  │    │    Tavern     │   │
    │    │   Modules     │    📋 Bulletin  │    │  Discussions  │   │
    │    │     📚        │    ⛲ Fountain  │    │     🍺        │   │
    │    │               │    🐎 Hitching  │    │               │   │
    │    │   [Floors     │       Post      │    │  [Activity    │   │
    │    │    unlock     │                 │    │   indicators] │   │
    │    │    as you     │      @ YOU      │    │               │   │
    │    │   progress]   │                 │    │               │   │
    │    └───────────────┘                 │    └───────────────┘   │
    │                                      │                        │
    │                                      │                        │
    │    ┌───────────────┐                │     ┌───────────────┐   │
    │    │  Assignment   │                │     │  Grade House  │   │
    │    │     Hall      │                │     │    Grades     │   │
    │    │ Courthouse    │ ← Main Street →│     │     Bank      │   │
    │    │     🏛️        │                │     │     📊        │   │
    │    │               │                │     │               │   │
    │    │  [Completion  │                │     │ [Performance  │   │
    │    │   checkmarks  │                │     │  decorations] │   │
    │    │   and flags]  │                │     │               │   │
    │    └───────────────┘                │     └───────────────┘   │
    │                                     │                         │
    │                                     │                         │
    │  Collaboration Corner               │                         │
    │  ┌──────────────┐  ┌──────────────┐│                         │
    │  │ Group House  │  │ People Plaza │                          │
    │  │   Groups     │  │    People    │                          │
    │  │     👥       │  │     👤       │                          │
    │  └──────────────┘  └──────────────┘                          │
    │       │ │               │ │                                   │
    │       └─────────────────┘                                    │
    │                                                               │
    └─────────────────────────────────────────────────────────────────┘

    Legend:
    @ YOU   = Player starting position / current location
    🏛️      = Assignment Hall (Main building, grand courthouse)
    🍺      = Discussion Tavern (Saloon with swinging doors)
    📚      = Learning Library (Multi-floor academy)
    📊      = Grade House (Bank/accounting office)
    📁      = General Store (Files)
    📮      = Post Office (External Tools)
    🏆      = Hall of Fame (Achievements)
    👥      = Group House (Collaborations)
    👤      = People Plaza (Course roster)
    📋      = Bulletin Board (Announcements)
    ⛲      = Town Fountain (Social gathering)
    🐎      = Hitching Post (Quick navigation)
```

## Movement Paths

```
    Building Access Routes:

    Main Buildings (Primary Canvas Navigation):
    Assignment Hall ←→ Town Square ←→ Discussion Tavern
                    ↑                    ↑
                    │                    │
                    ↓                    ↓
              Learning Library     Grade House

    Side Streets:
    Town Square → Achievement Avenue (North)
                → Resource Row (Northeast)  
                → Collaboration Corner (South)

    Quick Navigation:
    Hitching Post = Fast travel menu between buildings
```

## Building State Visual Indicators

```
    Assignment Hall States:
    🏛️     = Normal state
    🏛️🔴   = Overdue assignments (red flag)
    🏛️🟡   = Due soon (yellow banner)
    🏛️✅   = All complete (green checkmark)
    🏛️💡   = New assignment (glowing)

    Discussion Tavern States:
    🍺     = Quiet (no new activity)
    🍺🔥   = Hot discussion (flames/activity)
    🍺👥   = Crowded (many participants)
    🍺📬   = New posts (mailbox)

    Learning Library States:
    📚     = Base library
    📚🌟   = New module unlocked
    📚⛓️    = Locked content
    📚💡   = Current module highlighted
    📚📖   = Module in progress

    Grade House States:  
    📊     = Normal
    📊📈   = Recent good grades (trending up)
    📊📉   = Needs attention (trending down)
    📊💰   = High performance (golden decoration)
```

## Interactive Elements Layout

```
    Town Square Detail View:
    
         📋 Bulletin Board
         ┌─────────────────┐
         │ • New Announce  │
         │ • Course Update │
         │ • Deadline Rem. │
         └─────────────────┘
              
              ⛲ Fountain
           (Social Hub)
         
         🐎 Hitching Post
         ┌─────────────────┐
         │ Quick Navigate: │
         │ → Assignments   │
         │ → Discussions   │  
         │ → Modules       │
         │ → Grades        │
         └─────────────────┘
```

This ASCII layout gives us a clear foundation for the 2D world structure!