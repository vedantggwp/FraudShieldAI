# Changelog

All notable changes to FraudShield AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- API versioning (`/api/v1/`)
- Batch upload endpoint
- Email parsing endpoint
- Export functionality (CSV, PDF)
- User feedback mechanism
- Azure OpenAI integration
- Azure AI Search integration

---

## [1.0.0] - 2026-01-09

### Added

#### Backend
- FastAPI application with REST endpoints
- Transaction CRUD operations (`GET`, `POST` `/transactions`)
- Transaction detail with explanation (`GET /transactions/{id}`)
- Health check endpoint (`GET /health`)
- Rule-based anomaly detection with weighted scoring
- Template-based explanation generation
- Provider abstraction layer for LLM and pattern matching
- Mock providers for development without API keys
- Local JSON pattern matching provider
- 20 demo transactions with varied risk scenarios
- 10 fraud pattern definitions

#### Frontend
- Next.js 14 application with App Router
- Dashboard with transaction table and stats
- Transaction detail page with risk explanation
- Dark/light theme toggle
- Responsive design
- Animated UI with Framer Motion
- SWR for data fetching and caching

#### Documentation
- README with quick start guide
- ARCHITECTURE document with system diagrams
- METHODOLOGY document with scoring algorithm
- SECURITY policy
- PRIVACY policy
- API reference
- Contributing guidelines

#### Infrastructure
- Environment configuration (`.env.example`)
- Git ignore rules
- Setup script

### Detection Factors
- `NEW_PAYEE` — New recipient detection (weight: 0.25)
- `UNUSUAL_TIMING` — Off-hours transaction (weight: 0.25)
- `AMOUNT_SPIKE` — Amount exceeds 3x average (weight: 0.30)
- `SUSPICIOUS_REFERENCE` — Urgency keywords (weight: 0.15)

### Risk Levels
- HIGH: score ≥ 0.65
- MEDIUM: score 0.35-0.64
- LOW: score < 0.35

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-01-09 | Initial release with MVP features |

---

## Migration Guides

### Upgrading to 1.0.0

This is the initial release. No migration required.

---

## Deprecation Notices

None at this time.
