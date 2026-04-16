# 🎨 PRD → Design Playbook
**Session 03 Companion · แปลง PRD สู่ Frontend Design**

> **สำหรับ Session 03:** UX Translation: PRD to Design × Tan
> Running case study: [Thinktank Events PRD](./prd-thinktank-events.md)

---

## 🎯 Learning Outcome

หลังจบ session ผู้เรียนจะสามารถ:
1. **อ่าน PRD เป็น designer** — รู้ว่าอะไรสำคัญ อะไรข้าม
2. **แปลง PRD → artifact ที่ dev implement ได้** ผ่าน 7 ขั้นตอน
3. **ตัดสินใจ design trade-off** โดยใช้ PRD เป็น "ground truth"
4. **Map PRD sections → design tokens/components** อย่างเป็นระบบ

---

## 1. Mindset Shift

PM เขียน PRD ด้วยภาษา **"ทำอะไร"** · Designer ต้องแปลเป็นภาษา **"รู้สึกยังไง + เห็นอะไร + คลิกตรงไหน"**

| PM writes | Designer reads as |
|---|---|
| "User ต้องลงทะเบียนได้" | "Entry point อยู่ไหน? → Form field อะไร? → Confirmation state?" |
| "Support 3 roles" | "Permission matrix? → Navigation varies? → Empty states?" |
| "Must be accessible" | "Contrast? → Touch target? → Screen reader flow? → Keyboard?" |
| "< 60 วินาที" | "Number of fields · field type · prefill strategy · auto-advance" |

**Designer's job:** แปลง requirement → **ประสบการณ์ที่ touch ได้**

---

## 2. The 7-Step Translation Framework

```
PRD ────────► Information Architecture ────────► User Flow ────────► Wireframe
                                                                        │
                                                                        ▼
Frontend Code ◄──── Handoff Specs ◄──── Hi-fi Design ◄──── Component Spec
```

| Step | Input | Output | Time |
|---|---|---|---|
| **1. Decompose PRD** | PRD doc | Feature list + priority matrix | 30 min |
| **2. Map IA** | Features, roles | Site map + navigation pattern | 1-2 hr |
| **3. User Flow** | User stories | Screen-by-screen flow diagram | 2-4 hr |
| **4. Wireframe** | Flow + IA | Low-fi screens (grayscale) | 1-2 day |
| **5. Component Spec** | Wireframes | Atomic design inventory | 1 day |
| **6. Hi-fi Design** | Components + tokens | Visual design + states + motion | 3-5 day |
| **7. Handoff** | Hi-fi | Dev spec doc + tokens + assets | 1 day |

---

## 3. Step-by-Step (Using Thinktank Events)

### Step 1 — Decompose PRD

#### 3.1.1 สิ่งที่ extract จากแต่ละ section

| PRD Section | Designer uses for... |
|---|---|
| §2 Problem Statement | Empathy — ทำไมคนใช้ |
| §3 Goals & Metrics | Success criteria ของ design |
| §4 Personas | **ทุกหน้าจอต้องตอบคำถาม:** "persona ไหน context อะไร" |
| §6 User Stories | **1 story = 1 flow minimum** |
| §7 User Journey | IA skeleton |
| §8 Functional Req | Feature list for component spec |
| §9 Non-functional | Constraints: perf budget, a11y baseline |
| §11 Key Screens | Starting screen list |
| §12 Experience Design | **ฝ่าฝ่าย feel · จะแยก designer จริงกับ UI decorator** |
| §15.1 Edge Cases | States to design (not just happy path) |

#### 3.1.2 Decomposition Exercise (จาก Thinktank)

**Input:** PRD §6 Employee Stories (E1-E8)

**Output:** Feature-to-Screen mapping table

| Story | Primary Screen | Secondary | Components needed |
|---|---|---|---|
| E1 ดู Announce | Event Detail | Dashboard card | EventCard, HeroBanner, AgendaList |
| E2 ลงทะเบียน | Registration Form | Confirmation | FormField, Button, SuccessToast |
| E3 กรอกเมนู | Menu Selection | — | MenuCard, RadioGroup, AllergyInput |
| E4 โหวตธีม | Theme Vote | Result live | ThemeCard, VoteButton, LiveCounter |
| E5 ประเมิน | Feedback Form | Thank you | StarRating, Textarea, AnonToggle |
| E6 Leaderboard | Leaderboard | Detail drill | Podium, Ranked List, Avatar |
| E7 My Score | Stats page | — | BarChart, TrendLine, Comparison |
| E8 Personal Rank | Personal Leader | — | RankBadge, DeltaIndicator |

> ✅ **Pro tip:** ถ้า 1 story ต้องใช้ > 3 screens แปลว่า story ใหญ่เกิน · แบ่งใน PRD ก่อน

---

### Step 2 — Information Architecture

#### 3.2.1 หลักการ

1. **Role-first navigation** (ไม่ใช่ feature-first) — พนักงานเห็นเฉพาะสิ่งที่พนักงานใช้
2. **Phase-aware states** — Dashboard เปลี่ยนตาม event phase (Before/During/After)
3. **Contextual entry points** — Link จาก notification → deep link ตรงไปที่ screen

#### 3.2.2 IA จาก PRD §7 + §10

```
Employee view:
┌─────────────────────────────────────┐
│ 🔔 Notifications                    │
├─────────────────────────────────────┤
│ Home Tab:                           │
│   ├─ Active Event Card [Phase: BEF] │
│   │   ├─ Register   (primary CTA)   │
│   │   ├─ Menu       (locked)        │
│   │   └─ Vote theme (locked)        │
│   │                                 │
│   └─ Past Events (collapsed)        │
├─────────────────────────────────────┤
│ Leaderboard Tab: (After phase only) │
├─────────────────────────────────────┤
│ Me Tab:                             │
│   ├─ My Score                       │
│   └─ Settings                       │
└─────────────────────────────────────┘
```

**Design decision:** Tab vs drawer? → Tab (3-4 items) ดีกว่าสำหรับ mobile-first

#### 3.2.3 Common IA Traps

❌ **Mirror PRD structure 1:1** — PRD organize by feature, UI organize by user mental model
❌ **Same nav for all roles** — HR และ Employee ใช้ระบบเดียวกันไม่ได้
❌ **Static navigation** — phase changes · nav ต้อง reflect

---

### Step 3 — User Flow

#### 3.3.1 Flow granularity

สำหรับแต่ละ user story เขียน flow ใน 3 ชั้น:

**ชั้น 1 — Happy path** (เบื้องต้น, 1 flow)
```
Entry → Input → Validate → Submit → Success
```

**ชั้น 2 — Branches** (decision points)
```
                   ┌─ Valid ──→ Submit ─→ Success
Entry → Input ────┤
                   └─ Invalid → Error → (back to Input)
```

**ชั้น 3 — Edge cases** (จาก PRD §15.1)
```
Entry → Check permission ─┬─ Authorized → Input...
                           └─ Blocked → Permission denied screen
       │
       └─ Network offline → Cache + queue → Submit when online
```

#### 3.3.2 Exercise (E2 ลงทะเบียน)

```
    ┌─────────────┐
    │ Event Detail │
    └──────┬──────┘
           │ tap "ลงทะเบียน"
           ▼
    ┌─────────────┐      invalid    ┌──────────────┐
    │ Registration├───────────────► │ Inline Error │
    │    Form     │                 └──────┬───────┘
    └──────┬──────┘                        │ fix
           │ valid                          │
           ▼                                ▼
    ┌─────────────┐                 ┌──────────────┐
    │ Confirmation│◄────────────────┤    Form      │
    │    Modal    │                 └──────────────┘
    └──────┬──────┘
           │ confirm (+ optimistic)
           ▼
    ┌─────────────┐      offline   ┌──────────────┐
    │   Success   │◄───────────────┤ Queued · sync│
    │ Screen+ICS  │                 │  when online │
    └─────────────┘                 └──────────────┘
```

> 💡 **From PRD §12.6:** กด confirm → optimistic update (ไม่รอ API) · rollback ถ้า fail

---

### Step 4 — Wireframe

#### 3.4.1 Low-fi rules

- **ใช้สีเทาอย่างเดียว** — บังคับ focus ที่ layout ไม่ใช่ aesthetics
- **Real copy** (จาก PRD §15.7) — ไม่ใช่ Lorem Ipsum
- **Real data** (ไม่ใช่ "Button 1", "Title here") — ใช้ตัวอย่างจาก PRD
- **Mobile first** — เริ่ม mobile แล้วค่อยขยาย

#### 3.4.2 Wireframe Checklist per screen

จาก PRD §11.3 ทุก screen ต้องมี:
- [ ] **Default state** (happy path)
- [ ] **Loading state** (skeleton/spinner)
- [ ] **Empty state** (no data)
- [ ] **Error state** (inline/blocking)
- [ ] **Success state** (toast/modal/inline)
- [ ] **Edge variations** (from PRD §15.1)

#### 3.4.3 Decision: Where to place primary CTA?

จาก PRD §12.4 Context of Use:
- Employee registration = บนมือถือ ขณะเดินทาง → **Bottom-fixed CTA** (thumb zone)
- HR scan QR = ยืน ตึงเครียด → **Center huge button** (no miss)
- C-Level rating = iPad ใต้สายตาคน → **Big corner CTA + confirm** (privacy + accident-proof)

> ✅ Design decisions ต้อง **trace back to PRD sections** ทุกครั้ง

---

### Step 5 — Component Specification

#### 3.5.1 Atomic decomposition (จาก PRD §11.2)

**Case:** Registration Form screen

```
RegistrationForm (Template)
├── PageHeader (Organism)
│   ├── BackButton (Atom)
│   └── Title (Atom)
├── EventSummaryCard (Molecule)
│   ├── Image (Atom)
│   ├── EventTitle (Atom)
│   └── DateTime (Atom)
├── FormBody (Organism)
│   ├── FormField (Molecule: Name, prefilled)
│   ├── FormField (Molecule: Email, prefilled readonly)
│   ├── FormField (Molecule: Department, prefilled readonly)
│   └── PrivacyConsent (Molecule)
│       ├── Checkbox (Atom)
│       └── LinkText (Atom)
└── ActionBar (Organism · sticky bottom)
    ├── CancelButton (Atom · Ghost)
    └── SubmitButton (Atom · Primary)
```

#### 3.5.2 Component spec template

ทุก component ต้อง deliver:

```markdown
## [Component Name]

**Type:** Atom / Molecule / Organism
**Used in:** [screens where it appears]

### Anatomy
[Diagram of parts]

### Variants
- Primary / Secondary / Ghost / Destructive

### Sizes
- sm (32px) / md (40px) / lg (48px)

### States
- Default / Hover / Focus / Active / Disabled / Loading

### Token Mapping
- Background: color.brand.primary
- Text: color.neutral.white
- Radius: radius.md
- Padding: spacing.3 spacing.4

### Accessibility
- Role: button
- Keyboard: Enter/Space activate
- Screen reader: [aria-label pattern]

### Motion
- Tap: scale(0.95) 100ms ease-out
- Hover: brightness(1.05) 150ms
```

---

### Step 6 — Hi-fi Design

#### 3.6.1 Token mapping (PRD → Design Tokens)

จาก PRD §12 + design-tokens.json:

| PRD concept | Token used | Example |
|---|---|---|
| "Primary brand" | `color.brand.primary` | #F05A28 Registration CTA |
| "Success state" | `color.semantic.success` | Check-in complete |
| "Danger / allergy alert" | `color.semantic.danger` | Allergy highlight |
| "Card radius" | `radius.xl` (16px) | All event cards |
| "Touch target C-Level" | `sizing.touch.target` (44px) → override 56px | Rating button |
| "Card spacing" | `spacing.6` (24px) | Between cards |
| "Body text size" | `typography.size.body` (16px) | Default |
| "Shadow card" | `shadow.md` | Event cards |
| "Reduce motion duration" | `motion.duration.fast` (100ms) | Button tap |

#### 3.6.2 Design decisions tracked back to PRD

| Decision | Justification in PRD |
|---|---|
| Dark header on email | §12.1 Clarity · brand consistency |
| 44px+ touch target | §9.2 WCAG + §12.4 C-Level ipad context |
| Auto-save every 10s | §12.8 Recovery · §15.1 Edge (browser close) |
| Anonymous default ON | §12.7 Trust + §9.7 Privacy |
| Confetti on registration | §12.9 Delight moment |
| Hide bottom 50% of leaderboard | §15 Risk (toxicity) + §12.2 Emotional |
| Big "ดิ๊ง" audio on scan | §12.6 Microinteraction + §12.4 HR stress context |

---

### Step 7 — Handoff

#### 3.7.1 Handoff deliverables checklist

สำหรับ 1 feature ต้องส่ง dev ครบ:

- [ ] **Figma file** — ครบทุก state ของทุก screen
- [ ] **Interaction spec** — micro-animations ด้วย timing + easing
- [ ] **Token JSON** — export จาก Figma variables
- [ ] **Asset export** — SVG icons + PNG/WEBP images @1x @2x @3x
- [ ] **Copy sheet** — TH/EN tables ทุก string
- [ ] **Empty/error state copy** — จาก §15.7
- [ ] **A11y notes** — aria-labels, keyboard flow, screen reader behavior
- [ ] **Edge case doc** — จาก §15.1 พร้อม UI behavior
- [ ] **API contract** (with backend) — fields needed per screen
- [ ] **Dev QA checklist** — visual diff baseline

#### 3.7.2 Figma → Code mapping

| Figma | Code equivalent |
|---|---|
| Component | React Component |
| Variant | Component prop (`variant="primary"`) |
| Auto Layout | Flexbox/Grid |
| Variable | CSS custom property / Tailwind token |
| Style | TailwindCSS class or styled-component |
| Component instance | `<Button />` with props |

**Example:** Button atom in Figma → React

```tsx
// From Figma variant: Button / Primary / md
<Button variant="primary" size="md" onClick={...}>
  ยืนยันเข้าร่วม
</Button>

// Maps to:
// background: token(color.brand.primary)
// color: token(color.neutral.white)
// padding: token(spacing.3) token(spacing.6)
// borderRadius: token(radius.md)
// fontSize: token(typography.size.body)
// fontWeight: token(typography.weight.semibold)
```

---

## 4. Anti-patterns (สิ่งที่ designer มักพลาด)

| ❌ Anti-pattern | ✅ Better | Why |
|---|---|---|
| Design happy path เท่านั้น | Design 6 states ทุก screen | Dev ต้องถาม · ล่าช้า · bugs |
| ใช้ Lorem ipsum | Real copy จาก PRD §15.7 | Copy เปลี่ยน layout · ค้นพบปัญหาช้า |
| "Designer feel" แทน tokens | Trace ทุกค่ากลับ token | Inconsistency · ยาก maintain |
| 1 screen = 1 Figma frame | 1 screen = N states + variants | Incomplete handoff |
| Skip mobile | Mobile first | 70% ของ user บน mobile |
| ไม่ถาม edge case | List จาก PRD §15.1 ตรวจก่อน design | Found bugs ช่วง dev = 10x cost |
| ใช้ pixel-perfect ทุก screen | Responsive tokens | แตกเมื่อ resize |
| Design in isolation | Pair กับ dev ใน Figma review | Catch infeasibility ก่อน |

---

## 5. Quick Reference — PRD section → Design artifact

> ใช้เป็น cheatsheet ตอนทำงานจริง

| PRD Section | Design Artifact |
|---|---|
| §4 Personas | User archetype cards · empathy map |
| §6 User Stories | Flow diagrams (1 flow per story) |
| §7 User Journey | IA map · navigation pattern |
| §8 FR | Feature list · component inventory |
| §9.2 A11y | A11y annotation layer in Figma |
| §11.1 Screen list | Figma page structure |
| §11.3 UI States | All-states artboards per screen |
| §11.4 Permissions | Variant by role · conditional UI |
| §12.2 Emotional | Tone in copy + color + motion |
| §12.3 MoT | Over-invested screens |
| §12.4 Context | Device / posture mockups |
| §12.6 Microinteractions | Motion spec · Principle/Jitter file |
| §12.10 Inclusive | High-contrast variant · reduced-motion variant |
| §15.1 Edge cases | Alternative flows · error screens |
| §15.7 Copy | UX writing source of truth |

---

## 6. Live Exercise (ในงาน)

### Exercise 1 — Decompose (15 min)
จาก PRD §6.2 H4 (HR Scan QR)
- เขียน Feature-to-Screen mapping
- List components needed (atom/molecule/organism)

### Exercise 2 — Flow Sketch (20 min)
วาด flow สำหรับ H4 รวม:
- Happy path
- Camera permission denied
- Duplicate scan
- Offline mode

### Exercise 3 — State Variants (20 min)
สำหรับ QR Scanner screen:
- Design 6 states (default, loading, empty=no camera, error, success, dupli)
- Use real copy จาก PRD §15.7

### Exercise 4 — Token Mapping (10 min)
จาก design ที่วาด · map 10 values กลับไปที่ token ใน `design-tokens.json`

### Exercise 5 — Dev Handoff (15 min)
เขียน Figma comment / spec สำหรับ 1 component ที่ dev จะรับไป implement

---

## 7. Tooling Stack

| Phase | Tool | Why |
|---|---|---|
| PRD reading | Markdown + VSCode | Searchable · diffable |
| IA/Flow | Whimsical / FigJam | Fast sketching |
| Wireframe | Figma (grayscale styles) | Same file = easier handoff |
| Component spec | Figma + Storybook | Live component docs |
| Hi-fi | Figma + Variables | Token-first design |
| Motion spec | Principle / Figma Prototype / Lottie | Real motion feel |
| Handoff | Figma Dev Mode · Code Connect | Map Figma → code |
| Copy | Notion / Sheets | TH/EN parallel translation |
| QA | Percy · Chromatic | Visual regression |

---

## 8. Takeaway Principles (ตัวใหญ่)

> **1. PRD = ground truth · อะไรไม่มีใน PRD = ต้องเขียน add แล้ว ค่อยออกแบบ**
>
> **2. Every design decision must trace back to a PRD section · "Because it looks nice" ≠ reason**
>
> **3. Happy path = 10% ของงาน · Edge + states + a11y = 90%**
>
> **4. Design for context of use (§12.4) · not just "on a phone screen"**
>
> **5. Token-first · Component-first · Flow-first · THEN aesthetic polish**

---

## 9. Recommended Reading / References

- [Thinktank Events PRD](./prd-thinktank-events.md) — running case study
- [REALFACT Design Tokens](./design-system/design-tokens.json)
- [WCAG 2.2 Checklist](./references/wcag-checklist.md) (if available)
- [ARIA Patterns](./references/aria-patterns.md) (if available)
- "Don't Make Me Think" — Steve Krug
- "Refactoring UI" — Adam Wathan & Steve Schoger
- "Atomic Design" — Brad Frost (atomic hierarchy)

---

## 📎 Session Flow Suggestion (สำหรับ Tan presenting)

**13:00–13:20** · Intro + Mindset shift (§1)
**13:20–13:40** · 7-step framework overview (§2)
**13:40–14:30** · Walk-through Thinktank PRD (Step 1–3 ด้วย real doc)
**14:30–14:45** · ☕ Break
**14:45–15:15** · Live Exercise (pick 1 exercise จาก §6)
**15:15–15:30** · Handoff tips (§7) + Q&A + closing
