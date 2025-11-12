// Queries - READ operations (CQRS)
//
// Queries read state without changing it.
// Each query is in its own module.

pub mod conversion;
pub mod storage;
