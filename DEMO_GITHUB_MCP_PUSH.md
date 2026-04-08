# Demo: Pushing Files Using GitHub MCP Tools

This file demonstrates how to push content to GitHub using only GitHub MCP tools, without using git commands.

## Method 1: Using `create_or_update_file`

This is the simplest method for pushing a single file:

```json
{
  "owner": "RaihanShirakawa",
  "repo": "BOB_SDLC_GIT",
  "path": "example.md",
  "content": "# Hello World\n\nThis is my content.",
  "message": "Add example file",
  "branch": "main"
}
```

## Method 2: Using `push_files`

This method allows pushing multiple files in a single commit:

```json
{
  "owner": "RaihanShirakawa",
  "repo": "BOB_SDLC_GIT",
  "branch": "main",
  "files": [
    {
      "path": "file1.md",
      "content": "Content of file 1"
    },
    {
      "path": "file2.md",
      "content": "Content of file 2"
    }
  ],
  "message": "Add multiple files"
}
```

## Advantages of GitHub MCP Tools

1. **No local git required** - Works directly with GitHub API
2. **Atomic operations** - Multiple files in single commit
3. **Remote-first** - Perfect for automation and CI/CD
4. **Cross-platform** - Works anywhere with API access

---

**Created:** April 8, 2026  
**Purpose:** Demonstration of GitHub MCP tools usage