# Parking lot

<!-- ABOUTME: Noticed-but-not-fixed items for this repo, one dated line each, naming the file concerned. -->
<!-- ABOUTME: Reviewed by Rob in batches; nothing here is owed a fix. -->

- 2026-11-27 · `references/file-schemas.md` § `authorship` (outline): author-revision detection by word count misses a same-length hand edit to a freshly generated local outline with no prior version in `store.history` (pre-existing; ISSUE079E slice 1 review #2).
- 2026-11-27 · `references/store/storystormer.md` § Migration: a local scene-split chapter's one Blueprint (all scene blocks) and the app's per-scene Blueprint files don't convert in either direction (pre-existing; ISSUE079E slice 1 review #11).
- 2026-11-27 · `tools/md-profile-check.ts`: outline section heads are linted loosely: a wrapped key line passes (the app stores only its first line as the key), the rewrite rules still fire on reserved heads, `## Scene 1 ##` and indented key lines differ from the app's parser, `.MD` loses the outline mode, and the fixture test checks lint acceptance, not byte preservation (ISSUE079E slice 1 review #12–15, #21).
- 2026-11-27 · `references/store/storystormer.md` § Quirks: finer points not yet stated: a stored source frontmatter block reconciled on read and metadata-only re-outlines snapshotting the same body; the chapter file's authorship/version can be Scene 2's when Scene 1 has no outline; `if_revision` can't tell two byte-identical scene files apart after a reorder (ISSUE079E slice 1 review #16–18).
