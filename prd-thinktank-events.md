# PRD: Thinktank Events
**Internal Event Management Platform**

---

## 📋 Document Metadata

| Field | Value |
|---|---|
| **Product Name** | Thinktank Events |
| **Version** | 1.0 (MVP) |
| **Status** | Draft for Design |
| **Owner** | Product Team · Real Factory |
| **Author** | (ตัวอย่างสำหรับ Session 03: PRD → Design) |
| **Last Updated** | 2026-04-16 |
| **Target Release** | Q3 2026 |
| **Related Figma** | [User Journey](https://www.figma.com/design/bi6vHIEAT3XDL38VMpKInq/Thinktank-Events?node-id=12-4) · [Brainstorm Board](https://www.figma.com/design/bi6vHIEAT3XDL38VMpKInq/Thinktank-Events?node-id=10-46) |

---

## 1. Executive Summary

**Thinktank Events** คือ web platform ภายในองค์กรสำหรับบริหารจัดการกิจกรรมประเภท think tank / team activity / knowledge sharing — ตั้งแต่การประกาศ agenda, การลงทะเบียน, การจัดกลุ่ม, สแกน QR เข้างาน, โหวตธีม, สุ่มคิวนำเสนอ, ไปจนถึง feedback และ leaderboard หลังงาน

**Why now:** ปัจจุบันทีม HR จัดกิจกรรมแบบ manual — ใช้ Google Form + Google Sheet + LINE แยกกันหลายที่ ข้อมูลกระจัดกระจาย ไม่มี single source of truth และไม่สามารถวัดผลกิจกรรมได้ชัดเจน

**Outcome ที่คาดหวัง:** ลดเวลาเตรียมงาน 50%, เพิ่ม engagement ของพนักงาน (rating ≥ 4.0/5), และมี data-driven feedback loop สำหรับ C-Level ประเมินกิจกรรม

---

## 2. Problem Statement

### 2.1 Current Pain Points

| Role | Pain |
|---|---|
| **พนักงาน (Employee)** | ต้องกรอกฟอร์มหลายฟอร์ม (ลงทะเบียน/เมนูอาหาร/โหวตธีม) · ไม่รู้คะแนนของทีม · ไม่มี transparency เรื่องผลงานตัวเอง |
| **HR** | รวบรวมข้อมูลจากหลาย source · จัดกลุ่มแบบ manual · สุ่มคิวด้วย Excel · Export รายชื่อยาก |
| **C-Level** | ไม่มีเครื่องมือให้คะแนนและ feedback อย่างเป็นระบบ · ต้องจดลงกระดาษ |

### 2.2 Opportunity
ทำให้ทุก role มี **single place** สำหรับ workflow ของตัวเองใน 3 phases (ก่อน/ระหว่าง/หลังงาน) พร้อม data visualization และ gamification ที่ช่วยกระตุ้น participation

---

## 3. Goals & Success Metrics

### 3.1 Business Goals (OKR)

| Objective | Key Result | Metric |
|---|---|---|
| **O1** ลดต้นทุนการจัดงาน | KR1: ลด HR prep time เหลือ ≤ 2 ชั่วโมง/งาน | Time tracking |
| **O2** เพิ่ม engagement | KR2: Completion rate ของ feedback form ≥ 80% | DB query |
| **O3** Data-driven decisions | KR3: 100% ของงานมีรายงาน feedback + score ภายใน 24 ชม. หลังงานจบ | Report generation |

### 3.2 Product Metrics (ดูใน Analytics)

- **Adoption**: ≥ 95% ของพนักงานที่ได้รับเชิญเข้าลงทะเบียนใน 1 สัปดาห์
- **Activation**: ≥ 90% ของผู้ลงทะเบียน scan QR เข้างานจริง
- **Retention**: ≥ 70% ของผู้เข้าร่วมใช้ feature "คะแนนส่วนตัว" หลังงาน 1 สัปดาห์
- **Satisfaction**: NPS ≥ 40 จาก exit survey

### 3.3 Design Success Criteria

- ทุก task หลัก (ลงทะเบียน, โหวต, ประเมิน) จบภายใน ≤ 3 clicks / ≤ 60 วินาที
- Mobile completion rate ≥ desktop (งานจัดในสถานที่ พนักงานใช้ผ่านมือถือ)
- Accessibility: WCAG 2.2 AA
- Thai UX copy clarity: user testing ≥ 4.5/5 สำหรับ "เข้าใจง่าย"

---

## 4. Target Users

### 4.1 Persona 1 — **"พี่แนน" พนักงาน (Employee)**

- **Who**: พนักงานทั่วไป อายุ 25-40 ปี ใช้มือถือ iOS เป็นหลัก
- **Goal**: เข้าร่วมงานได้ง่าย รู้คะแนนตัวเองและทีม สนุกกับกิจกรรม
- **Frustration**: ฟอร์มเยอะ · ไม่รู้ว่าทีมได้อันดับที่เท่าไหร่ · Link หาย
- **Success looks like**: กดแค่ 2-3 ครั้งก็ลงทะเบียนเสร็จ และได้ push notification เตือนก่อนงาน 1 วัน

### 4.2 Persona 2 — **"พี่เจน" HR Admin**

- **Who**: HR Coordinator · อายุ 30-45 · ใช้ laptop เป็นหลัก · จัดงาน 4-6 ครั้ง/ปี
- **Goal**: เตรียมงานเร็ว · จัดกลุ่มพนักงานตามเกณฑ์ที่กำหนด · Export ข้อมูลไปทำรายงาน
- **Frustration**: Google Sheet ล่ม · พนักงานตอบฟอร์มซ้ำ · ต้องตามทวงข้อมูล
- **Success looks like**: เปิด dashboard เห็นสถานะทุกอย่างที่เดียว · Export CSV ได้ทันที

### 4.3 Persona 3 — **"คุณต้น" Management (C-Level)**

- **Who**: ผู้บริหาร · อายุ 40+ · ใช้มือถือ/iPad ในงาน · tech-comfort ปานกลาง
- **Goal**: ให้คะแนนทีมอย่างเป็นระบบ · เห็นภาพรวมผลงานทุกทีม · ให้ feedback ส่วนตัวเป็นความลับ
- **Frustration**: UI ซับซ้อน · กดผิดยากแก้ · กลัวคะแนนหลุด
- **Success looks like**: UI ใหญ่ชัด · confirm ก่อนส่งทุกครั้ง · ให้คะแนนเสร็จใน 30 วินาที/ทีม

---

## 5. Scope

### 5.1 In Scope (MVP)

✅ 3 Phases × 3 Roles = 9 cells (ตาม User Journey map)
✅ Authentication ผ่าน SSO ขององค์กร (Azure AD)
✅ Responsive web (mobile-first)
✅ Thai language เป็นหลัก · EN toggle
✅ Email + LINE Notify integration สำหรับ reminder
✅ CSV export
✅ Admin dashboard สำหรับ HR

### 5.2 Out of Scope (Post-MVP / v2)

❌ Native mobile app (ใช้ PWA แทน)
❌ Video streaming ระหว่างงาน
❌ AI-powered group matching (v2)
❌ Multi-tenant (รองรับแค่ Real Factory ก่อน)
❌ Payment / ticketing (ไม่มีค่าใช้จ่าย)

---

## 6. User Stories

### 6.1 Employee Stories

| ID | Story | Priority | Acceptance Criteria |
|---|---|---|---|
| **E1** | ในฐานะพนักงาน ฉันต้องการดู Announce / Agenda กิจกรรม เพื่อวางแผนเข้าร่วม | P0 | แสดง agenda 24 ชม. หลังประกาศ · มี add-to-calendar |
| **E2** | ในฐานะพนักงาน ฉันต้องการลงทะเบียนเข้าร่วมงาน ใน ≤ 3 clicks | P0 | Form มี prefill ข้อมูลจาก SSO · confirm ด้วย email |
| **E3** | ในฐานะพนักงาน ฉันต้องการเลือกเมนูอาหารล่วงหน้า รวมถึงแจ้งแพ้อาหาร | P0 | Dropdown เมนู · field "แพ้อาหาร" · deadline 3 วันก่อนงาน |
| **E4** | ในฐานะพนักงาน ฉันต้องการโหวตธีมกิจกรรมที่ชอบ | P1 | เลือก 1 ธีมจาก N · เห็นผลโหวต realtime หลังกด (optional: จนถึง deadline) |
| **E5** | ในฐานะพนักงาน ฉันต้องการประเมินกิจกรรม เพื่อ feedback ให้ทีมจัดงาน | P0 | Rating 1-5 · free-text · Anonymous option |
| **E6** | ในฐานะพนักงาน ฉันต้องการดู Leaderboard ของทีม | P1 | Top 10 · อันดับตัวเอง highlight · อัปเดตหลังจบงาน |
| **E7** | ในฐานะพนักงาน ฉันต้องการดูคะแนน + กราฟสถิติของตัวเอง | P1 | Bar chart เทียบ AVG ทีม · trend ย้อนหลัง 3 งาน |
| **E8** | ในฐานะพนักงาน ฉันต้องการดูอันดับของตัวเอง (Leader Board Me) | P2 | Rank ปัจจุบัน · delta จากงานก่อน |

### 6.2 HR Stories

| ID | Story | Priority | Acceptance Criteria |
|---|---|---|---|
| **H1** | ในฐานะ HR ฉันต้องการดู/ดาวน์โหลดรายชื่อผู้ลงทะเบียน | P0 | ตาราง sortable · filter by department · export CSV/Excel |
| **H2** | ในฐานะ HR ฉันต้องการดู/ดาวน์โหลดสรุปเมนูอาหาร | P0 | Count by menu · alert สำหรับแพ้อาหาร · export สำหรับ catering |
| **H3** | ในฐานะ HR ฉันต้องการตั้งค่าตัวเลือกโหวตธีม | P0 | Create / edit / delete ตัวเลือก · set voting deadline |
| **H4** | ในฐานะ HR ฉันต้องการสแกน QR เพื่อ check-in พนักงาน | P0 | Web camera scan · แสดงชื่อ/ทีม · offline queue ถ้าเน็ตหลุด |
| **H5** | ในฐานะ HR ฉันต้องการจัดกลุ่มพนักงาน (manual หรือ random) | P0 | Drag-drop UI · auto-balance by department · bulk assign |
| **H6** | ในฐานะ HR ฉันต้องการสุ่มคิวการนำเสนอ (Random) | P0 | Animation สุ่ม · ดึง queue จาก group list · lock หลังสุ่ม |
| **H7** | ในฐานะ HR ฉันต้องการดู/ดาวน์โหลดผล Feedback | P0 | Aggregate view · sentiment summary · export CSV |

### 6.3 Management Stories

| ID | Story | Priority | Acceptance Criteria |
|---|---|---|---|
| **M1** | ในฐานะ C-Level ฉันต้องการให้คะแนนแต่ละทีมได้ง่าย | P0 | Rating UI ใหญ่ชัด · confirm ก่อนส่ง · แก้ไขได้จนปิดโหวต |
| **M2** | ในฐานะ C-Level ฉันต้องการให้ feedback รายทีม (optional) | P1 | Free-text / voice note · visible to HR only |

---

## 7. User Journey Map

> อ้างอิง Figma: `User Journey / Thinktank Events` ([node 22:2](https://www.figma.com/design/bi6vHIEAT3XDL38VMpKInq/Thinktank-Events?node-id=12-4))

```
           │  BEFORE  (ก่อนงาน)        │  DURING  (ระหว่างงาน)        │  AFTER  (หลังงาน)
───────────┼───────────────────────────┼──────────────────────────────┼───────────────────────────────
 EMPLOYEE  │ 1. ดู Announce            │  เข้าร่วมกิจกรรม             │ 5. ประเมินกิจกรรม
           │ 2. ลงทะเบียน              │  (passive)                  │ 6. Leader Board (Team)
           │ 3. กรอกเมนูอาหาร          │                              │ 7. คะแนนส่วนตัว
           │ 4. โหวตธีม                │                              │ 8. Leader Board (Me)
───────────┼───────────────────────────┼──────────────────────────────┼───────────────────────────────
 HR        │ 1. ดูรายชื่อ              │ 5. จัดกลุ่ม                  │ (ไม่มี action)
           │ 2. ดูเมนูอาหาร            │ 6. คิว Present (random)     │
           │ 3. ตั้งค่าโหวตธีม         │ 7. ดูผลประเมิน               │
           │ 4. Scan QR                │                              │
───────────┼───────────────────────────┼──────────────────────────────┼───────────────────────────────
 C-LEVEL   │ (ไม่มี action)            │ (ไม่มี action)               │ 1. โหวต / ให้คะแนน
           │                           │                              │ 2. Feedback Team (optional)
```

**Critical dependencies:**
- `HR.ตั้งค่าโหวตธีม` → ต้องทำก่อน `Employee.โหวตธีม`
- `Employee.ลงทะเบียน` → ต้องทำก่อน `HR.Scan QR` และ `HR.จัดกลุ่ม`
- `HR.จัดกลุ่ม` → ต้องทำก่อน `HR.คิว Present`
- `Employee.ประเมินกิจกรรม` → ปิดก่อน `C-Level.โหวต`

---

## 8. Functional Requirements

### 8.1 FR-AUTH — Authentication

- **FR-AUTH-01**: Login ด้วย SSO (Azure AD / Google Workspace)
- **FR-AUTH-02**: Role detection จาก AD group: `EMPLOYEE` / `HR` / `C_LEVEL`
- **FR-AUTH-03**: Session timeout 8 ชั่วโมง · auto-refresh token
- **FR-AUTH-04**: Logout ชัดเจน · ยืนยันก่อน logout

### 8.2 FR-EVENT — Event Management

- **FR-EVENT-01**: HR สร้าง event พร้อม metadata: ชื่อ, วันที่, สถานที่, description, banner image
- **FR-EVENT-02**: Status lifecycle: `DRAFT` → `PUBLISHED` → `REGISTRATION_OPEN` → `ACTIVE` → `CLOSED`
- **FR-EVENT-03**: Timeline: Registration deadline / Menu deadline / Voting deadline / Event start / Feedback deadline
- **FR-EVENT-04**: Notify พนักงานเมื่อ status → PUBLISHED (email + LINE)

### 8.3 FR-REG — Registration

- **FR-REG-01**: Prefill ชื่อ/email/department จาก SSO
- **FR-REG-02**: Confirm / Cancel · แก้ไขได้จนถึง deadline
- **FR-REG-03**: Capacity limit (optional) — first-come-first-served หรือ waitlist
- **FR-REG-04**: Send confirmation email พร้อม ICS calendar attachment

### 8.4 FR-MENU — Food Menu

- **FR-MENU-01**: HR เพิ่ม/ลบ/แก้ไขเมนู (name, image, tag: หมู/ไก่/มังสวิรัติ/ฮาลาล)
- **FR-MENU-02**: พนักงานเลือก 1 เมนู · ระบุแพ้อาหารเป็น free-text (max 200 chars)
- **FR-MENU-03**: HR ดู aggregate count + allergy alert (highlighted red)
- **FR-MENU-04**: Lock ไม่ให้แก้หลัง deadline

### 8.5 FR-THEME — Theme Voting

- **FR-THEME-01**: HR สร้างตัวเลือก 2-6 ธีม พร้อมภาพ/description
- **FR-THEME-02**: พนักงานโหวต 1 ธีม · ไม่มี anonymous (ผูกกับ user id)
- **FR-THEME-03**: HR เลือก reveal results live หรือรอ deadline
- **FR-THEME-04**: Export winner เป็น internal announcement

### 8.6 FR-CHECKIN — QR Check-in

- **FR-CHECKIN-01**: Generate unique QR code ต่อ registration · มีอายุเท่า event
- **FR-CHECKIN-02**: HR scan ด้วย web camera · แสดง feedback visual/audio สำเร็จ
- **FR-CHECKIN-03**: Offline mode: เก็บ scan ไว้ใน localStorage · sync เมื่อมี network
- **FR-CHECKIN-04**: Duplicate scan alert (กัน scan ซ้ำ)
- **FR-CHECKIN-05**: HR ดู dashboard realtime check-in rate

### 8.7 FR-GROUP — Group Management

- **FR-GROUP-01**: HR ตั้งจำนวนกลุ่ม (2-20)
- **FR-GROUP-02**: Auto-assign: random · balance by department · balance by seniority
- **FR-GROUP-03**: Manual adjust ด้วย drag-drop
- **FR-GROUP-04**: Lock groups หลัง confirm · notify group members ทาง email

### 8.8 FR-QUEUE — Random Presentation Queue

- **FR-QUEUE-01**: ดึง groups จาก FR-GROUP · สุ่มลำดับ
- **FR-QUEUE-02**: Animation แบบ slot machine 3-5 วินาที (option skip)
- **FR-QUEUE-03**: Lock queue หลังสุ่ม · edit ต้อง confirm
- **FR-QUEUE-04**: Big-screen mode: full-screen display สำหรับฉายในงาน

### 8.9 FR-RATE — Management Rating

- **FR-RATE-01**: C-Level เห็น list ของกลุ่ม · tap เพื่อให้คะแนน
- **FR-RATE-02**: Rating ด้วย star 1-5 หรือ slider · custom criteria (creativity / feasibility / presentation)
- **FR-RATE-03**: Confirm dialog ก่อนส่ง · edit ได้จนปิดโหวต
- **FR-RATE-04**: Anonymous option (hide C-Level identity ใน aggregate)

### 8.10 FR-FEEDBACK — Employee Feedback

- **FR-FEEDBACK-01**: Rating 1-5 (overall, food, organization, content)
- **FR-FEEDBACK-02**: Free-text "อะไรดี / อะไรควรปรับปรุง" (max 500 chars)
- **FR-FEEDBACK-03**: Anonymous toggle (default: on)
- **FR-FEEDBACK-04**: HR ดู aggregate view + sentiment summary (simple keyword cloud)

### 8.11 FR-LEADER — Leaderboards

- **FR-LEADER-01**: Team leaderboard: rank, team name, total score, delta
- **FR-LEADER-02**: Personal leaderboard: rank ของ user · top 10 · user row highlighted
- **FR-LEADER-03**: Animation podium top 3
- **FR-LEADER-04**: Publish delay: 10 นาทีหลัง C-Level โหวตเสร็จ (ให้ HR review ก่อน)

### 8.12 FR-STATS — Personal Stats

- **FR-STATS-01**: Bar chart คะแนนรวม · เทียบ team average
- **FR-STATS-02**: Trend line ย้อนหลัง 3-5 events ล่าสุด
- **FR-STATS-03**: Badge / achievement (v2)

### 8.13 FR-NOTIFY — Notification Strategy

#### 8.13.1 Channel Matrix

| Trigger | Email | LINE/Push | In-App | SMS |
|---|:---:|:---:|:---:|:---:|
| Event published | ✅ | ✅ | ✅ | — |
| Registration confirmed | ✅ (with ICS) | — | ✅ | — |
| Menu deadline T-1d | — | ✅ | ✅ | — |
| Theme vote opens | — | ✅ | ✅ | — |
| Reminder T-1d | ✅ | ✅ | — | — |
| Reminder T-1h | — | ✅ | ✅ | — |
| Group assigned | ✅ | ✅ | ✅ | — |
| Feedback request T+1h | — | ✅ | ✅ | — |
| Leaderboard published | — | ✅ | ✅ | — |
| Critical: Event cancelled | ✅ | ✅ | ✅ | ✅ |

#### 8.13.2 Rules
- **FR-NOTIFY-01**: Quiet hours 22:00–07:00 (เลื่อนส่งเป็นเช้าวันถัดไป) — ยกเว้น CRITICAL
- **FR-NOTIFY-02**: Frequency cap: ≤ 3 notifications/วัน/user/event
- **FR-NOTIFY-03**: User สามารถ opt-out รายช่องทาง (ยกเว้น CRITICAL)
- **FR-NOTIFY-04**: Copy ทุก notification ผ่าน UX writer review (ดู §15.7 Copy Guidelines)
- **FR-NOTIFY-05**: Deep link พาตรงไปที่ action ที่เกี่ยวข้อง

#### 8.13.3 Migration Note
LINE Notify จะถูก deprecate มี.ค. 2026 → ย้ายไปใช้ **LINE Messaging API** (ต้องสร้าง Official Account)

---

## 9. Non-Functional Requirements

### 9.1 Performance
- First Contentful Paint ≤ 1.5s บน 4G
- Time to Interactive ≤ 3s
- API response p95 ≤ 500ms
- Rating submit latency ≤ 200ms (perceived instant)

### 9.2 Accessibility
- **WCAG 2.2 Level AA**
- Keyboard navigation ครบทุก flow
- Screen reader: `aria-label`, `aria-live` สำหรับ toast/notify
- Contrast ≥ 4.5:1 (body) · ≥ 3:1 (large text)
- Touch target ≥ 44×44 px (C-Level rating UI ต้องใหญ่กว่านี้: 56px)

### 9.3 Security
- HTTPS only · HSTS
- Data encryption at rest (AES-256) สำหรับ feedback text
- Role-based access control (RBAC)
- Audit log: ทุก action ของ HR + C-Level บันทึก user_id/timestamp/action

### 9.4 Reliability
- Uptime ≥ 99.5% ช่วง event day
- Backup ทุก 6 ชม. · restore RTO ≤ 4 ชม.
- Offline support สำหรับ QR scan (FR-CHECKIN-03)

### 9.5 Browser Support
- Chrome/Safari/Edge 2 versions ล่าสุด
- iOS Safari 15+ · Android Chrome 100+
- ไม่รองรับ IE

### 9.6 Localization
- TH เป็นภาษาหลัก · EN toggle
- Date format: `DD MMM YYYY` (เช่น 16 เม.ย. 2026)
- Number format: Thai Arabic numerals optional
- Pluralization: TH ไม่มี singular/plural แต่ EN ต้องรองรับ ("1 person" vs "5 people")

### 9.7 Privacy & PDPA Compliance (กฎหมายไทย)

#### 9.7.1 Personal Data Categories

| Category | Examples | Sensitivity | Lawful Basis |
|---|---|---|---|
| **Identity** | name, email, dept | Standard | Legitimate interest (employment) |
| **Sensitive** | food allergy, dietary | **HIGH** (health data) | Explicit consent required |
| **Behavioral** | votes, ratings, feedback | Standard | Legitimate interest |
| **Anonymous** | aggregated feedback | None | N/A |

#### 9.7.2 Required Consent Flow
- **FR-PDPA-01**: First-time users เห็น consent screen ก่อนใช้งาน — แยก checkbox สำหรับ:
  - [ ] ใช้ข้อมูลส่วนบุคคลเพื่อจัดงาน (required)
  - [ ] เก็บข้อมูลสุขภาพ (food allergy) — separate consent
  - [ ] รับ notification ทาง email/LINE (opt-in)
- **FR-PDPA-02**: User สามารถถอน consent ได้ใน `/profile/privacy`
- **FR-PDPA-03**: Right to access: download ข้อมูลตัวเองเป็น JSON/PDF
- **FR-PDPA-04**: Right to delete: request ลบข้อมูลภายใน 30 วัน
- **FR-PDPA-05**: ทุก export/download log audit trail พร้อม purpose

#### 9.7.3 Data Retention
| Data type | Active retention | Archive | Hard delete |
|---|---|---|---|
| Registration | Event +90d | 1 ปี | 2 ปี |
| Feedback (anonymized) | Indefinite | — | On request |
| Feedback (identified) | Event +90d | — | 1 ปี |
| Audit log | 1 ปี | 5 ปี (compliance) | After 5 ปี |

#### 9.7.4 Cross-border Transfer
- Hosting: AWS Singapore (ap-southeast-1) — within ASEAN
- ห้ามใช้ US region สำหรับ employee data
- Vendor (catering) ส่งแค่ aggregate menu count + allergy text — ไม่มี name

#### 9.7.5 DPO Contact
- Display ใน footer + privacy policy: `dpo@real-factory.co`

---

## 10. Information Architecture

### 10.1 Site Map

```
/
├── /login                           [ALL]
├── /dashboard                       [ALL — content varies by role]
│
├── /events
│   ├── /events/:id                  [ALL — event detail]
│   ├── /events/:id/register         [EMPLOYEE]
│   ├── /events/:id/menu             [EMPLOYEE]
│   ├── /events/:id/vote-theme       [EMPLOYEE]
│   ├── /events/:id/feedback         [EMPLOYEE]
│   ├── /events/:id/my-score         [EMPLOYEE]
│   ├── /events/:id/leaderboard      [EMPLOYEE]
│   │
│   ├── /events/:id/admin            [HR]
│   │   ├── /participants            [HR — รายชื่อ]
│   │   ├── /menu-summary            [HR — เมนูอาหาร]
│   │   ├── /theme-setup             [HR — ตั้งค่าโหวต]
│   │   ├── /check-in                [HR — Scan QR]
│   │   ├── /groups                  [HR — จัดกลุ่ม]
│   │   ├── /queue                   [HR — คิว present]
│   │   └── /feedback-report         [HR]
│   │
│   └── /events/:id/judge            [C_LEVEL]
│       ├── /rate                    [C_LEVEL — ให้คะแนน]
│       └── /team-feedback           [C_LEVEL — optional]
│
└── /profile                         [ALL]
```

### 10.2 Navigation Pattern

- **Mobile**: Bottom nav 3-4 tab ตาม role
- **Desktop**: Sidebar นำทาง + breadcrumb
- **Global header**: Logo · Event selector · Notification · Profile

---

## 11. Key Screens (Design Handoff List)

> ส่วนนี้คือหัวใจสำหรับ designer — list ของหน้าที่ต้องออกแบบ พร้อม components

### 11.1 Screen Inventory

| # | Screen | Role | Priority | Key Components |
|---|---|---|---|---|
| 1 | **Login** | ALL | P0 | SSO button, logo, footer |
| 2 | **Employee Dashboard** | EMP | P0 | Event card, action list, notification badge |
| 3 | **Event Detail** | ALL | P0 | Hero banner, agenda list, action buttons (contextual by role + phase) |
| 4 | **Registration Form** | EMP | P0 | Prefilled form, confirm button, success state |
| 5 | **Menu Selection** | EMP | P0 | Menu cards with image, allergy input, submit |
| 6 | **Theme Voting** | EMP | P1 | Theme cards, vote CTA, live results (if enabled) |
| 7 | **Feedback Form** | EMP | P0 | Star rating × 4 criteria, textarea, anonymous toggle |
| 8 | **My Score** | EMP | P1 | Bar chart, comparison, trend line |
| 9 | **Team Leaderboard** | EMP | P1 | Podium top 3, ranked list, my team highlight |
| 10 | **HR Dashboard** | HR | P0 | Event list, quick stats, action cards |
| 11 | **Participants Table** | HR | P0 | Data table, filter bar, export CTA |
| 12 | **Menu Summary** | HR | P0 | Aggregate chart, allergy list (red), export |
| 13 | **Theme Setup** | HR | P0 | CRUD theme options, image upload, deadline picker |
| 14 | **QR Scanner** | HR | P0 | Camera viewport, check-in feedback toast, counter |
| 15 | **Group Manager** | HR | P0 | Drag-drop grid, auto-assign settings, confirm |
| 16 | **Queue Randomizer** | HR | P0 | Slot-machine animation, fullscreen mode, lock state |
| 17 | **Feedback Report** | HR | P0 | Score summary, comments list, sentiment cloud |
| 18 | **C-Level Rate** | MGT | P0 | Large team card, 5-star rating, custom criteria, confirm modal |
| 19 | **Team Feedback** | MGT | P1 | Textarea / voice note upload |
| 20 | **Profile / Settings** | ALL | P1 | User info, language toggle, logout |

### 11.2 Component Inventory (Atomic Design)

**Atoms** (reusable primitives):
- Button (Primary/Secondary/Ghost/Destructive × sm/md/lg)
- Input (text/number/email/search)
- Icon (FontAwesome pattern · sm/md/lg/xl)
- Avatar (sm/md/lg/xl)
- Badge (status/count/role)
- StarRating · Toggle · Checkbox · Radio

**Molecules**:
- FormField (label + input + error)
- EventCard (image + title + date + CTA)
- StatCard (label + number + trend)
- MenuCard (image + name + tags + selector)
- ThemeCard (image + title + vote button + vote count)
- ParticipantRow (avatar + name + dept + status)

**Organisms**:
- Header / Sidebar / BottomNav
- DataTable (sort/filter/pagination/export)
- QRScanner (camera + overlay + feedback)
- GroupBoard (drag-drop grid)
- LeaderboardPodium
- FeedbackModal

**Templates**:
- DashboardTemplate
- EventDetailTemplate
- FormTemplate
- AdminTableTemplate

### 11.3 UI States Specification

ทุก screen ต้องออกแบบครบ 6 states (designer ต้อง deliver ทั้งหมด ไม่ใช่แค่ happy path):

| State | When | Pattern |
|---|---|---|
| **Loading** | Data fetching | Skeleton (list/table) · Spinner (button) · Shimmer (card) |
| **Empty** | No data ยัง | Illustration + headline + CTA · ห้ามแสดงตารางว่าง |
| **Partial** | Some data, more loading | Show what we have + skeleton ส่วนที่เหลือ |
| **Error (recoverable)** | API fail, network | Inline error + retry CTA · message: "ปัญหา + วิธีแก้" |
| **Error (blocking)** | Permission, 404, 500 | Full-page error + back to safe place |
| **Success** | Action completed | Toast (transient) · Modal (important) · Inline (form-level) |

#### 11.3.1 Per-screen state requirements (sample)

| Screen | Empty | Loading | Error |
|---|---|---|---|
| Employee Dashboard | "ยังไม่มี event ที่จะเข้าร่วม · รอการแจ้งเตือน" + illustration | Skeleton card × 3 | "ดึงข้อมูลไม่ได้ · ลองใหม่" + retry |
| Participants Table (HR) | "ยังไม่มีคนลงทะเบียน" + share invite CTA | Skeleton rows × 10 | Inline banner + retry |
| QR Scanner (HR) | (no empty — always camera) | "กำลังเปิดกล้อง..." | "ไม่พบกล้อง · ใช้ manual check-in" |
| Feedback Report (HR) | "ยังไม่มี feedback · ปิดงานก่อนเพื่อเปิด form" | Skeleton + chart placeholder | Retry |
| Leaderboard | "งานยังไม่จบ · เปิดดูได้หลัง 16 เม.ย. 18:00" + countdown | Skeleton podium | Retry |

### 11.4 Permission Matrix (Detailed)

✅ = Full access · 👁 = Read only · 📊 = Aggregate only · ❌ = No access

| Resource / Action | EMPLOYEE | HR | C-LEVEL |
|---|:---:|:---:|:---:|
| **Event** create/edit/delete | ❌ | ✅ | 👁 |
| **Event** publish/unpublish | ❌ | ✅ | ❌ |
| Own registration | ✅ | 👁 (all) | ❌ |
| Other employees' registration | ❌ | ✅ | 📊 (count) |
| Menu options (CRUD) | ❌ | ✅ | ❌ |
| Own menu choice | ✅ | 👁 | ❌ |
| Allergy data (sensitive!) | ✅ (own) | 👁 (alert only) | ❌ |
| Theme options (CRUD) | ❌ | ✅ | ❌ |
| Theme vote (cast) | ✅ | ❌ | ❌ |
| Theme results | 👁 (after deadline) | 👁 (always) | 👁 (always) |
| QR scanner | ❌ | ✅ | ❌ |
| Group management | ❌ | ✅ | 👁 |
| Queue randomizer | ❌ | ✅ | 👁 (display) |
| Submit feedback | ✅ | ❌ | ❌ |
| Read individual feedback | ❌ | 👁 (if not anonymous) | ❌ |
| Read aggregate feedback | 📊 (own team only) | 👁 | 👁 |
| Cast team rating | ❌ | ❌ | ✅ |
| See own ratings given | ❌ | ❌ | ✅ |
| **See other C-Level's ratings** | ❌ | 📊 (aggregate) | ❌ |
| Leaderboard (Team) | 👁 | 👁 | 👁 |
| Leaderboard (Personal) | 👁 (own + top 10) | 👁 | 👁 |
| Export CSV/PDF | ❌ | ✅ | 👁 (own actions) |
| Audit log | ❌ | 👁 (own actions) | ❌ |
| User settings | ✅ (own) | ✅ (own) | ✅ (own) |

#### 11.4.1 Privacy thresholds
- Anonymous feedback: เปิดดูได้เมื่อมี ≥ **5 responses** (ป้องกัน identify)
- C-Level identity ใน aggregate: ซ่อนเมื่อมี C-Level votes < **3 คน**
- Department-level filter: HR กรอง dept ที่มีคน < **3** ได้แต่ไม่แสดง name

---

## 12. Experience Design

> ส่วนนี้ define **"รู้สึกอย่างไรเมื่อใช้"** ไม่ใช่แค่ "ทำอะไรได้บ้าง" — เป็น layer ที่ designer ต้อง translate จาก functional req (§8) สู่ feeling

### 12.1 Design Principles (จาก CLAUDE.md + REALFACT brand)

1. **Mobile First** — employee flow design มือถือก่อน, HR desktop ก่อน
2. **Clarity over cleverness** — UI C-Level ต้อง "อ่านครั้งเดียวเข้าใจ"
3. **Consistency** — ใช้ Design Tokens ของ REALFACT (Orange #F05A28 primary)
4. **Accessibility first** — WCAG 2.2 AA ตั้งแต่เริ่ม ไม่ใช่เรื่อง post-hoc
5. **Progressive disclosure** — แสดงเฉพาะ action ที่เกี่ยวข้องตาม phase
6. **Forgiveness** — ทุก destructive action กลับได้ · มี undo window
7. **Calm UI** — สีสด/animation ใช้เฉพาะ moment ที่ต้องการ attention

### 12.2 Emotional Journey Map

นอกจาก action ที่ทำ (§7) ต้อง map **อารมณ์** ของแต่ละ persona ในแต่ละ phase:

#### 12.2.1 Employee Emotional Arc

| Phase | Action | Feeling | Risk | Design intervention |
|---|---|---|---|---|
| ดู Announce | เห็นโปสเตอร์งาน | 🤔 Curious | "งานน่าเบื่อหรือเปล่า?" | Hero image + agenda preview · social proof "X เพื่อนลงทะเบียนแล้ว" |
| ลงทะเบียน | กรอกฟอร์ม | 😐 Neutral → 😊 Confident | กลัวกรอกผิด | Prefill ทุกอย่างที่ทำได้ · success animation |
| กรอกเมนู | เลือกอาหาร | 😋 Anticipating | "เมนูดูน่ากินไหม?" | รูป food appetizing · tag ชัด · reviews (v2) |
| โหวตธีม | กดโหวต | 🤩 Excited | "โหวตนี้นับไหม?" | Live count update · confirmation toast |
| รอวันงาน | ก่อนงาน | 😴 Forgetting | ลืมเวลา/สถานที่ | Reminder T-1d + T-1h · ICS calendar |
| Check-in | scan QR | 😬 Anxious (queue) | "scan ไม่ผ่านจะอาย" | Big QR · clear visual feedback · alt fallback |
| ระหว่างงาน | นั่งฟัง | 🎯 Engaged → 😴 Tired | สมาธิ drop | (out of app scope · session 03 facilitator design) |
| Feedback | กรอกฟอร์ม | 😤 Tired/บ่น | ขี้เกียจ | < 60 วินาที · slider ดีกว่า text · anonymous default |
| ดู leaderboard | เปิดดูอันดับ | 🎉 Excited / 😞 Disappointed | กลัวอันดับสุดท้าย | Celebrate top 3 · ไม่แสดง bottom · positive copy |

#### 12.2.2 HR Emotional Arc

| Phase | Action | Feeling | Risk | Design intervention |
|---|---|---|---|---|
| สร้าง event | start เปิดระบบ | 😰 Overwhelmed (เยอะมาก) | จำขั้นตอนไม่ได้ | Wizard 8-step checklist + save draft anytime |
| ตามรายชื่อ | refresh ดู | 😬 Anxious (กลัวคนน้อย) | นำเสนอ boss ไม่ได้ | Live counter · ส่ง reminder ตรงจาก dashboard |
| Scan QR | ใต้ time pressure | 🥵 Stressed (queue ยาว) | scan ไม่ทัน · ผิดพลาด | Camera response < 500ms · audio confirm · counter visible |
| จัดกลุ่ม | drag-drop | 🧩 Focused | สลับกลุ่มยาก | Auto-balance + manual override · undo history |
| สุ่มคิว | กลางงาน | 😅 Nervous (ทุกคนดู) | technical glitch live | Big-screen mode tested · fallback static list |
| ดูผล feedback | หลังงาน | 😟 Apprehensive (กลัวคำติ) | feedback แรงๆ | Sentiment summary first · raw text behind expand |

#### 12.2.3 C-Level Emotional Arc

| Phase | Action | Feeling | Risk | Design intervention |
|---|---|---|---|---|
| ให้คะแนน | ส่ง rating | 🤨 Skeptical (กลัว UI พัง) | กดผิดส่งผิดทีม | Big team card · confirm modal · edit window 10 นาที |
| ดูผล | aggregate view | 🧐 Analytical | "เกณฑ์ตรงกันไหม?" | Show criteria definitions inline · my vs avg comparison |

### 12.3 Moments of Truth (MoT)

จุดที่ user **ตัดสินใจว่ารักหรือเลิกใช้** ระบบ — ต้อง over-invest ใน design

| MoT | Why critical | Success criteria | Failure cost |
|---|---|---|---|
| **First registration** | ครั้งแรก = first impression | ≤ 30 วินาที · 1 click confirm | "ระบบยุ่งยาก" — เลิกใช้ |
| **QR scan ที่หน้างาน** | High pressure · social moment | < 1 วินาที · audio "ดิ๊ง" feedback | คน รอ · HR เครียด · ทุกคนเห็น |
| **Submit feedback** | Last touchpoint · กำหนด NPS | < 60 วินาที · feel anonymous safe | คนไม่กรอก · loss data |
| **Leaderboard reveal** | Emotional climax | Celebration animation · positive copy | Demotivating ถ้าทำพลาด |
| **C-Level first rating** | Adoption decision · ถ้าเขาบอก "ยาก" จบ | < 30 วินาที/team · zero error path | C-Level เลิกใช้ → ทั้งระบบล้ม |

### 12.4 Context of Use (สำคัญมาก!)

ต้องออกแบบให้รู้ว่า user อยู่ใน **context อะไรเมื่อใช้**:

| Touchpoint | Physical | Social | Cognitive | Design implication |
|---|---|---|---|---|
| Employee ลงทะเบียน | บนรถ/โต๊ะทำงาน · มือถือ | คนเดียว | Distracted multitask | Auto-save · resume from anywhere |
| Employee ระหว่างรอ event | ใน hall · ยืน/นั่ง · เสียงดัง | ในกลุ่ม · เห็นคนอื่น | Anxious (เริ่มงาน) | Big text · noisy-friendly (no audio cue critical) |
| HR scan QR | ที่ทางเข้า · standing · คนต่อแถว | กดดัน · ทุกคนรอ | High focus narrow | Single-purpose UI · no nav · no distraction |
| HR จัดกลุ่ม | โต๊ะทำงาน · laptop | คนเดียว | Deep focus · 30+ นาที | Wide canvas · keyboard shortcuts · rich tooltips |
| C-Level ให้คะแนน | นั่งหัวโต๊ะ · iPad | ทุกคนเห็นว่ากำลังกด | กลัวกดผิด | Privacy hint · big touch target 56px · confirm |
| Employee ดู leaderboard | กลับบ้าน · นอน · มือถือ | คนเดียว · share social | Casual relax | Beautiful · shareable image export |

### 12.5 Cognitive Load Budget

แต่ละ screen ตั้ง budget ของสิ่งที่ user ต้อง decide/remember:

| Screen complexity | Max decisions | Max items visible | Use when |
|---|---|---|---|
| **Single-task** (1) | 1 primary action | ≤ 5 elements | Check-in scan · vote |
| **Form** (2) | ≤ 3 fields decisions | ≤ 7 fields total | Registration · feedback |
| **Browse** (3) | Filter + select | ≤ 12 items per fold | Menu · theme list |
| **Dashboard** (4) | Multi-context | ≤ 6 widgets | HR/admin views |

> Rule: ถ้า exceed budget → split เป็น multiple screens หรือ progressive disclosure

### 12.6 Microinteractions & Feedback

ทุก user action ต้องมี **immediate feedback ภายใน 100ms**:

| Action | Feedback type | Duration | Token |
|---|---|---|---|
| Tap button | Scale 0.95 + color darken | 100ms | `motion.fast` |
| Submit form | Spinner replace text | until response | — |
| Save success | Toast + check icon | 3s auto-dismiss | `success` color |
| Error | Shake + red border + helper text | 300ms shake | `danger` color |
| QR scan success | Green flash + "ดิ๊ง" + haptic | 500ms | `success` |
| QR scan fail | Red flash + "บื๊บ" + haptic | 500ms | `danger` |
| Vote submit | Confetti burst micro · disable button | 1s | `delight` |
| Leaderboard reveal | Number count-up animation | 1.5s | `ease-out` |
| Drag-drop group | Lift shadow + ghost preview | continuous | `motion.normal` |

### 12.7 Trust & Confidence Builders

User ไม่ trust → ไม่ใช้ · trust builders ที่ต้องมี:

| Where | Builder |
|---|---|
| Login | "Real Factory SSO · ปลอดภัย ไม่เก็บรหัสผ่าน" |
| Registration | Confirm screen แสดงข้อมูลก่อนส่ง · "แก้ไขได้จนถึง 14 เม.ย." |
| Anonymous feedback | Lock icon + "ตอบนิรนาม · HR ไม่เห็นชื่อคุณ" + how it works link |
| C-Level rating | "คะแนนของคุณซ่อน · แสดงเฉพาะ aggregate" |
| Data export | Receipt / log: "Export ครั้งที่ 3 · 16 เม.ย. 14:23 · purpose: catering brief" |
| Action history | Audit timeline ใน profile · transparency |
| Errors | Status page link · "ระบบกำลังตรวจสอบ · ไม่ใช่ที่คุณ" |

### 12.8 Recovery & Forgiveness

User ทำพลาดได้เสมอ — ระบบต้อง **make it easy to undo**:

| Mistake | Recovery path |
|---|---|
| ลงทะเบียนผิด event | Cancel button visible · 1 click · refund slot |
| เลือกเมนูผิด | Edit จนถึง deadline · last submission wins |
| โหวตธีมผิด | เปลี่ยนได้จนถึง deadline (option · HR config) |
| HR ลบ event accidentally | Soft delete 30 days · trash bin · restore CTA |
| HR scan ผิดคน | Long-press to undo last 5 scans · audit log |
| C-Level rate ผิดทีม | Edit 10-min window post-submit · clear "แก้ไขแล้ว" badge |
| Feedback กดส่งเร็วไป | Toast "ส่งแล้ว · แก้ไขได้ใน 24 ชม. [ดู]" |
| Form ปิดบราวเซอร์ | Auto-save draft ทุก 10s · resume on next open |

### 12.9 Delight Moments (Micro-joy)

จุดเล็กๆที่ทำให้ user "อมยิ้ม" — สำคัญกว่า feature เพิ่ม:

| Moment | Delight |
|---|---|
| Registration success | Confetti animation · "ยินดีต้อนรับ คุณ [ชื่อ]! 🎉" |
| Check-in | "👋 สวัสดี คุณ [ชื่อเล่น]! · ทีมของคุณ: [Team]" |
| Feedback submit | "ขอบคุณมาก! · feedback ช่วยให้ครั้งหน้าดีขึ้น 💛" |
| Top 3 leaderboard | Podium animation + brand sound (3-note jingle) |
| 100% participant check-in (HR) | "เต็มห้อง! 🎯 100% เข้างานแล้ว" — celebrate HR's effort |
| First-time C-Level rating | "Welcome! ครั้งแรก · ขอบคุณที่ร่วม shape ทีม 👏" |
| Empty state | Friendly illustration + ผ่อนคลาย · ไม่ใช่ "no data" cold |

### 12.10 Inclusive Design (เกินกว่า WCAG)

| Dimension | Consideration |
|---|---|
| **Generational** | C-Level 50+ vs Employee 25 — font size override · simple mode toggle |
| **Language** | TH primary แต่ expat 5% — mixed Thai-English UI in some labels |
| **Tech literacy** | Some HR ใช้คอมไม่คล่อง — guided wizard · keyboard shortcut hints |
| **Disability** | Color blind: ไม่ใช่สีอย่างเดียวบอก status (icon + text) · screen reader full support |
| **Religious/dietary** | Menu tags: หมู/ไก่/ฮาลาล/มังสวิรัติ/วีแกน — explicit ไม่กำกวม |
| **Physical** | บางคนแพ้แสง → respect dark mode preference · reduced motion |
| **Economic** | บางคนใช้มือถือเก่า → progressive enhancement · graceful degradation |
| **Time zone** | คนทำงาน remote ต่างประเทศ → show local time + event time |

### 12.11 Social Dynamics in UI

UI บางจุดถูกใช้ **ต่อหน้าคนอื่น** — ต้องคิด social dimension:

| Surface | Who watches | Design care |
|---|---|---|
| C-Level rating | ทุกคนในห้อง | Hide score on screen · animation neutral · "rating sent" not number |
| HR scan station | คนที่กำลังต่อแถว | Big result text (welcoming) · ไม่แสดง personal info |
| Leaderboard projection | All hands meeting | Top 3 only on main screen · full list on personal device |
| QR check-in result | Person ข้างหลัง | Show first name only · no email/phone |
| Theme vote results | Live during event | HR toggle: live or hold-until-deadline |

### 12.12 Time Perception

ความรู้สึก "เร็ว/ช้า" สำคัญกว่า ms จริง:

| Wait type | Perception trick |
|---|---|
| < 100ms | Feel instant · no feedback needed |
| 100ms – 1s | Spinner · keep button "pressed" state |
| 1s – 3s | Skeleton screen (feels 30% faster than spinner) |
| 3s – 10s | Progress bar with steps · "กำลัง..." copy เปลี่ยนทุก 2s |
| > 10s | Background job + email when done · "ไปทำอย่างอื่นได้" |
| Animation | 200-300ms for transitions · 1-1.5s for celebrations · ห้าม > 500ms ใน task path |

### 12.13 Cross-device Continuity

| Scenario | Experience |
|---|---|
| Employee เริ่มลงทะเบียนบน laptop จบบนมือถือ | Auto-save · resume from same step |
| HR scan บน iPad ดู dashboard บน laptop | Sync realtime via WebSocket |
| C-Level เปลี่ยน device กลาง rating | Resume same team/criteria · ไม่ reset |

### 12.14 End-of-Event Closure (Often Forgotten!)

UX ปกติเน้น "Get them in" แต่ **end matter ก็สำคัญ**:

- หลัง feedback submit: thank you + share moment ("เห็น photo งาน?" link to album)
- 24 ชม. หลังงาน: highlight email "Top moments จากงาน · score · podium"
- 1 สัปดาห์: invite to next event · "งานหน้า: [Topic] · save the date"
- Year-end: personal recap "ปี 2026 คุณร่วม X events · top score Y"

---

## 13. Technical Considerations

### 13.1 Proposed Stack (indicative)
- Frontend: Next.js 15 · React 19 · TailwindCSS · shadcn/ui
- Backend: Node.js (NestJS) · PostgreSQL · Redis (session/cache)
- Realtime: WebSocket สำหรับ check-in counter + live voting
- Auth: Azure AD OAuth
- Infra: Vercel (FE) + AWS (BE) · CloudFront CDN

### 13.2 Data Model (High-level)
```
User (id, sso_id, name, email, dept, role)
Event (id, title, dates, status, location)
Registration (user_id, event_id, status, menu_id, theme_vote_id)
Menu (id, event_id, name, tags, image)
Theme (id, event_id, name, image, votes_count)
Group (id, event_id, name, members[])
Score (id, event_id, group_id, rater_id, value, criteria)
Feedback (id, event_id, user_id, ratings{}, text, is_anonymous)
```

---

## 14. Rollout Plan

| Phase | Timeline | Scope | Success Gate |
|---|---|---|---|
| **Alpha** | Week 1-4 | FR-AUTH, FR-EVENT, FR-REG, FR-MENU | Internal team test 1 mock event |
| **Beta** | Week 5-8 | + FR-THEME, FR-CHECKIN, FR-GROUP, FR-QUEUE | Pilot 1 real event (50 คน) |
| **MVP** | Week 9-12 | + FR-RATE, FR-FEEDBACK, FR-LEADER, FR-STATS | Full rollout |
| **v1.1** | Post-launch | Optimizations · PWA install prompt | NPS ≥ 40 |

---

## 15. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| SSO integration ล่าช้า | High | Medium | เตรียม fallback email+OTP |
| WiFi ในงานห่วย → scan ไม่ได้ | High | High | Offline queue (FR-CHECKIN-03) |
| C-Level กดผิดส่งคะแนนก่อนพร้อม | Medium | Medium | Confirm modal + edit window |
| Leaderboard → competitive toxicity | Medium | Low | ไม่ show individual Bottom 10 · positive tone copy |
| Food allergy ข้อมูลหายในกรณี critical | High | Low | Dedicated allergy channel + HR alert |
| PDPA non-compliance | Critical | Low | Legal review · DPO sign-off ก่อน launch |
| Push notification fatigue → opt-out สูง | Medium | Medium | Frequency cap + user preference (FR-NOTIFY-02/03) |

### 15.1 Edge Cases & Failure Modes

| Scenario | Behavior |
|---|---|
| Event ถูก cancel กลางคัน | Notify ทุกช่อง (incl. SMS) · Refund effort already spent (token/badge) |
| Late registration หลัง deadline | HR สามารถ approve เป็น case-by-case · audit log บันทึก |
| No-show หลังลงทะเบียน | Mark `NO_SHOW` · ไม่ affect leaderboard · Email reminder T+1 |
| พนักงานลาออกก่อนงาน | Auto-deregister · soft delete data · notify HR |
| C-Level ส่งคะแนนช้ากว่า leaderboard publish | Hold publish จนครบ หรือ publish partial + แสดง "รอ X คน" |
| Camera ไม่ทำงาน (HR scan) | Manual check-in: search by name/code · log mode used |
| Network offline > 30 นาที | Queue actions ใน IndexedDB · sync ทันทีเมื่อเชื่อมต่อ · banner แจ้ง user |
| User เปลี่ยน role กลาง event | Apply new permissions on next login · ห้าม mid-session role swap |
| 2 events overlap เวลาเดียวกัน | UI alert · employee เลือกเข้าได้ event เดียวต่อ slot |
| Theme vote ทำได้ก่อน HR setup เสร็จ | Block UI · "ยังไม่เปิดโหวต · เริ่ม DD/MM HH:MM" |
| Duplicate QR scan (ผิดพลาด) | Show "เคย check-in แล้วเมื่อ HH:MM" · ไม่นับซ้ำ |
| Feedback ส่งซ้ำ | Allow update ภายใน 24 ชม. · log timestamp ล่าสุด |

### 15.2 Assumptions (Explicit)

> สมมติฐานที่ PRD นี้ยึดอยู่ — ถ้าข้อใดไม่จริง ต้อง revise PRD

1. **Devices**: พนักงาน 100% มี smartphone ที่รัน iOS 15+ / Android 10+
2. **Network**: WiFi ในสถานที่งานพอเพียงสำหรับ 100+ devices พร้อมกัน (ถ้าไม่ → invest router/AP)
3. **HR resources**: HR coordinator มี laptop + browser modern (Chrome/Edge/Safari)
4. **C-Level adoption**: C-Level ยินดีใช้ digital tool — ไม่ต้องการ paper fallback
5. **SSO**: Azure AD พร้อมและมี API access
6. **Catering vendor**: รับ menu count format CSV/Excel ได้
7. **Event scale**: 50–500 คน/event (ไม่ใช่ stadium scale)
8. **Frequency**: 4–6 events ต่อปี (ไม่ใช่ daily — capacity planning ตาม)
9. **Language**: TH เพียงพอสำหรับ 95% ของ user · EN สำหรับ expat (~5%)
10. **Legal**: PDPA consent ที่ได้มา cover use case ทั้งหมดในเอกสารนี้

### 15.3 Dependencies (Cross-team)

| Team | Need | Owner | Deadline |
|---|---|---|---|
| **IT / DevOps** | Azure AD app registration · API permissions | IT Lead | Week -2 |
| **IT / DevOps** | SSL cert · domain `events.real-factory.co` | IT Lead | Week -1 |
| **IT / Network** | WiFi capacity check + extender ถ้าจำเป็น | Network Admin | Week -1 |
| **Legal** | PDPA consent copy review · DPO sign-off | DPO | Week -3 |
| **Legal** | Privacy policy + Terms of service | Legal Counsel | Week -2 |
| **Marketing** | Email DKIM/SPF/DMARC config · template approval | Marketing Lead | Week -2 |
| **HR** | Master employee data export (initial seed) | HR Director | Week 0 |
| **Catering vendor** | Confirm CSV menu format · allergy escalation contact | HR | Week -1 |
| **Facility** | Power outlets สำหรับ scan station + check-in counter | Office Manager | Day -1 |
| **Comms / Internal** | Launch announcement + training video | Comms Lead | Week +1 |

### 15.4 Migration from Current Process

- **Phase 0 (T-30d)**: Parallel run — Google Form ยังเปิดอยู่ + Thinktank Events soft launch
- **Phase 1 (T-14d)**: Cutover — Google Form ปิดรับ · redirect ไป Thinktank
- **Phase 2 (T+30d)**: Decommission — archive Google Sheet · ล้าง form
- **Historical data**: ไม่ migrate (เริ่ม fresh จาก event ถัดไป) — ลด complexity

### 15.5 Onboarding & Training

#### 15.5.1 First-time User Experience
- **Employee**: Welcome modal + 3-slide tour (ดู event / ลงทะเบียน / feedback) · Skip ได้
- **HR**: Guided checklist สำหรับสร้าง event แรก (8 steps) · มี sample template
- **C-Level**: Demo mode พร้อม dummy data · 1-on-1 training 15 นาที

#### 15.5.2 Help & Support
- In-app help (`?` button → contextual tooltip)
- FAQ page · search by keyword
- Contact: `support@real-factory.co` · response SLA 24 ชม. / 1 ชม. ใน event day

### 15.6 Analytics & Tracking

#### 15.6.1 Tools
- **Web analytics**: GA4 (anonymized · no PII)
- **Product analytics**: PostHog self-hosted (in-region)
- **Error tracking**: Sentry

#### 15.6.2 Key Events to Track

| Event | Properties | Funnel |
|---|---|---|
| `event_viewed` | event_id, role | Awareness |
| `registration_started` | event_id | Activation |
| `registration_completed` | event_id, time_taken | Activation |
| `menu_selected` | menu_id, allergy_filled | Engagement |
| `theme_voted` | theme_id | Engagement |
| `qr_scanned` | mode (online/offline) | Attendance |
| `feedback_submitted` | rating_avg, anonymous, time_taken | Loyalty |
| `leaderboard_viewed` | tab (team/me) | Retention |

#### 15.6.3 Dashboards (build during dev)
- Funnel: View → Register → Check-in → Feedback (target ≥ 70% end-to-end)
- Time-to-complete per task (target ≤ 60s for register/feedback)
- Error rate per screen (alert > 1%)

### 15.7 Copy Guidelines (UX Writing)

#### 15.7.1 Tone of Voice
- **เป็นกันเองแต่สุภาพ** — ใช้ "เรา" แทน "บริษัท" · หลีกเลี่ยง "ท่าน"
- **ตรงประเด็น** — บอกสิ่งที่ user ต้องทำ ไม่ใช่สิ่งที่ system ทำ
  - ❌ "ระบบกำลังประมวลผลข้อมูลของคุณ"
  - ✅ "กำลังบันทึก..."

#### 15.7.2 Error Message Pattern
**[ปัญหา] + [วิธีแก้]** เสมอ

| ❌ Don't | ✅ Do |
|---|---|
| "Error 500" | "ระบบขัดข้องชั่วคราว · ลองใหม่อีกครั้งใน 1 นาที" |
| "Invalid input" | "อีเมลไม่ถูกต้อง · ลองเช็คเครื่องหมาย @ อีกครั้ง" |
| "Failed to save" | "บันทึกไม่ได้ · เช็คอินเทอร์เน็ตแล้วลองใหม่" |

#### 15.7.3 Button Labels
- ใช้ verb เสมอ: `บันทึก` / `ยืนยัน` / `ส่ง feedback` (ไม่ใช่ `ตกลง` / `OK`)
- Destructive: `ลบ event` (ระบุ object) ไม่ใช่ `ลบ`
- Cancel pattern: `ยกเลิก` (สีเทา ghost) อยู่ซ้าย, primary action ขวา

#### 15.7.4 Empty State Copy Pattern
**[สถานการณ์] + [ทำไม] + [ทำอะไรต่อ]**

ตัวอย่าง: "ยังไม่มี event ที่จะเข้าร่วม · HR จะส่งเชิญเมื่อมีงานใหม่ · ระหว่างนี้ดูประวัติได้ที่ My Events"

#### 15.7.5 Date/Number Format
- Date: `16 เม.ย. 2026` (พ.ศ. ใน parenthesis ถ้า formal: `16 เม.ย. 2569`)
- Time: `14:00 น.` (24h format, มี "น.")
- Number: `1,234` (Western Arabic, comma separator)
- Currency: ไม่ใช้ใน MVP

### 15.8 Feature Flags & Kill Switches

| Flag | Purpose | Default | Owner |
|---|---|---|---|
| `enable_leaderboard` | Kill switch ถ้าเกิด toxic behavior | ON | HR Director |
| `enable_anonymous_feedback` | A/B test impact on response rate | ON | Product |
| `enable_offline_scan` | Toggle ถ้า sync มีปัญหา | ON | Engineering |
| `gradual_rollout_percent` | % users ที่เห็น new release | 100 | Engineering |
| `enable_voice_feedback` | v1.1 feature beta | OFF | Product |

### 15.9 SLA & Incident Response

#### 15.9.1 Severity Levels

| Sev | Definition | Response | Resolution |
|---|---|---|---|
| **SEV-1** | System down ใน event day · scan ไม่ได้ | 15 นาที | 1 ชม. |
| **SEV-2** | Major feature broken · workaround มี | 1 ชม. | 4 ชม. |
| **SEV-3** | Minor bug · UI issue | 1 วัน | 1 สัปดาห์ |
| **SEV-4** | Cosmetic · enhancement | Next sprint | — |

#### 15.9.2 On-call (Event Day)
- Primary: 1 engineer + 1 PM standby ตลอด event
- Comm channel: Dedicated Slack `#event-day-warroom`
- Escalation: PM → Eng Lead → CTO (15-min intervals)

---

## 16. Open Questions

1. Anonymous feedback มี threshold ขั้นต่ำของจำนวน response ก่อนเปิดดูไหม (ป้องกัน identify)?
2. C-Level score สามารถดูของ C-Level คนอื่นได้หรือไม่?
3. Employee คนเดิมเข้าร่วมได้กี่ events ต่อปี (มี cap หรือไม่)?
4. ในกรณี event ถูก cancel ขั้น data retention กี่วัน?
5. LINE Notify จะ deprecate มีนา 2026 — ต้องย้ายไป LINE Messaging API

---

## 17. Appendix

### 17.1 Glossary

| Term | Definition |
|---|---|
| **Thinktank** | กิจกรรมระดมสมองประจำองค์กร จัดทุก Q |
| **Phase** | 3 ช่วงของ event: Before / During / After |
| **Role** | User category: Employee / HR / C-Level |
| **SSO** | Single Sign-On ผ่าน Azure AD |

### 17.2 References

- Figma User Journey: [node 12:4](https://www.figma.com/design/bi6vHIEAT3XDL38VMpKInq/Thinktank-Events?node-id=12-4)
- Figma Brainstorm: [node 10:46](https://www.figma.com/design/bi6vHIEAT3XDL38VMpKInq/Thinktank-Events?node-id=10-46)
- REALFACT Design Tokens: `design-system/design-tokens.json`
- WCAG 2.2 Checklist: `references/wcag-checklist.md`

### 17.3 Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 2026-04-15 | Team | Initial brainstorm (Figma sticky notes) |
| 0.5 | 2026-04-16 | Tan | Structured user journey map |
| **1.0** | **2026-04-16** | **Tan** | **PRD v1 for Design handoff** |

---

## 📎 How to use this PRD (for Session 03 audience)

**Exercise 1 — จาก Section 6 (User Stories) → Wireframe**
เลือก 1 story เช่น `E2: ลงทะเบียน` แล้วร่าง wireframe 3 screens: entry → form → confirm

**Exercise 2 — จาก Section 11 (Key Screens) → Component Map**
เลือก 1 screen เช่น `#18 C-Level Rate` แล้ว break ลงเป็น atoms/molecules/organisms

**Exercise 3 — จาก Section 7 (User Journey) → Information Architecture**
Map แต่ละ step ของ journey เป็น route ใน site map (Section 10.1) และระบุ navigation pattern

**Exercise 4 — จาก Section 12 (Design Principles) → Design Tokens**
Open [design-tokens.json](design-system/design-tokens.json) และ map ว่า screen ไหนใช้ token อะไรบ้าง (color/spacing/radius)
