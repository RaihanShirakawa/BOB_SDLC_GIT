# GitHub MCP Tools Reference Guide

Complete reference for all available GitHub MCP tools that can be used to interact with GitHub repositories.

## 📚 Table of Contents

1. [Repository Operations](#repository-operations)
2. [File Operations](#file-operations)
3. [Branch Operations](#branch-operations)
4. [Commit Operations](#commit-operations)
5. [Issue Operations](#issue-operations)
6. [Pull Request Operations](#pull-request-operations)
7. [Search Operations](#search-operations)
8. [User Operations](#user-operations)
9. [Release Operations](#release-operations)
10. [Label Operations](#label-operations)
11. [Team Operations](#team-operations)
12. [Review Operations](#review-operations)

---

## Repository Operations

### 1. `create_repository`
Create a new GitHub repository in your account or organization.

**Parameters:**
- `name` (required) - Repository name
- `description` (optional) - Repository description
- `private` (optional) - Whether repo should be private
- `autoInit` (optional) - Initialize with README
- `organization` (optional) - Organization to create repo in

**Example:**
```json
{
  "name": "my-new-repo",
  "description": "My awesome project",
  "private": false,
  "autoInit": true
}
```

### 2. `fork_repository`
Fork a GitHub repository to your account or organization.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `organization` (optional) - Organization to fork to

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "organization": "my-org"
}
```

### 3. `search_repositories`
Find GitHub repositories by name, description, readme, topics, or metadata.

**Parameters:**
- `query` (required) - Search query
- `sort` (optional) - Sort field: stars, forks, help-wanted-issues, updated
- `order` (optional) - Sort order: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)
- `minimal_output` (optional) - Return minimal info (default: true)

**Example:**
```json
{
  "query": "machine learning language:python stars:>1000",
  "sort": "stars",
  "order": "desc",
  "perPage": 10
}
```

---

## File Operations

### 4. `get_file_contents`
Get the contents of a file or directory from a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `path` (optional) - Path to file/directory (default: "/")
- `ref` (optional) - Git ref (branch/tag)
- `sha` (optional) - Commit SHA

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "path": "README.md",
  "ref": "main"
}
```

### 5. `create_or_update_file`
Create or update a single file in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `path` (required) - File path
- `content` (required) - File content
- `message` (required) - Commit message
- `branch` (required) - Branch name
- `sha` (optional) - SHA of file being replaced

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "path": "src/app.js",
  "content": "console.log('Hello World');",
  "message": "Update app.js",
  "branch": "main"
}
```

### 6. `push_files`
Push multiple files to a GitHub repository in a single commit.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `branch` (required) - Branch to push to
- `files` (required) - Array of file objects with path and content
- `message` (required) - Commit message

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "branch": "main",
  "files": [
    {"path": "file1.js", "content": "code1"},
    {"path": "file2.js", "content": "code2"}
  ],
  "message": "Add multiple files"
}
```

### 7. `delete_file`
Delete a file from a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `path` (required) - Path to file
- `message` (required) - Commit message
- `branch` (required) - Branch to delete from

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "path": "old-file.js",
  "message": "Remove old file",
  "branch": "main"
}
```

---

## Branch Operations

### 8. `create_branch`
Create a new branch in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `branch` (required) - Name for new branch
- `from_branch` (optional) - Source branch (defaults to repo default)

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "branch": "feature/new-feature",
  "from_branch": "main"
}
```

### 9. `list_branches`
List branches in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "perPage": 20
}
```

---

## Commit Operations

### 10. `list_commits`
Get list of commits of a branch in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `sha` (optional) - Commit SHA, branch or tag name
- `author` (optional) - Author username or email
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "sha": "main",
  "author": "gaearon",
  "perPage": 30
}
```

### 11. `get_commit`
Get details for a commit from a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `sha` (required) - Commit SHA, branch name, or tag name
- `include_diff` (optional) - Include file diffs (default: true)
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "sha": "abc123def456",
  "include_diff": true
}
```

---

## Issue Operations

### 12. `list_issues`
List issues in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `state` (optional) - Filter by state: OPEN, CLOSED
- `labels` (optional) - Filter by labels (array)
- `since` (optional) - Filter by date (ISO 8601)
- `orderBy` (optional) - Order by: CREATED_AT, UPDATED_AT, COMMENTS
- `direction` (optional) - Order direction: ASC, DESC
- `after` (optional) - Cursor for pagination
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "state": "OPEN",
  "labels": ["bug", "help wanted"],
  "orderBy": "CREATED_AT",
  "direction": "DESC"
}
```

### 13. `search_issues`
Search for issues in GitHub repositories.

**Parameters:**
- `query` (required) - Search query
- `owner` (optional) - Repository owner
- `repo` (optional) - Repository name
- `sort` (optional) - Sort field
- `order` (optional) - Sort order: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "query": "is:open label:bug",
  "owner": "facebook",
  "repo": "react",
  "sort": "created",
  "order": "desc"
}
```

### 14. `issue_read`
Get information about a specific issue.

**Parameters:**
- `method` (required) - Read operation: get, get_comments, get_sub_issues, get_labels
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `issue_number` (required) - Issue number
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "method": "get",
  "owner": "facebook",
  "repo": "react",
  "issue_number": 123
}
```

### 15. `issue_write`
Create or update an issue.

**Parameters:**
- `method` (required) - Write operation: create, update
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `issue_number` (optional) - Issue number (for update)
- `title` (optional) - Issue title
- `body` (optional) - Issue body
- `state` (optional) - State: open, closed
- `state_reason` (optional) - Reason: completed, not_planned, duplicate
- `labels` (optional) - Labels array
- `assignees` (optional) - Assignees array
- `milestone` (optional) - Milestone number
- `type` (optional) - Issue type
- `duplicate_of` (optional) - Issue number this is duplicate of

**Example:**
```json
{
  "method": "create",
  "owner": "myuser",
  "repo": "myrepo",
  "title": "Bug: App crashes on startup",
  "body": "Description of the bug...",
  "labels": ["bug", "high-priority"]
}
```

### 16. `add_issue_comment`
Add a comment to an issue or pull request.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `issue_number` (required) - Issue/PR number
- `body` (required) - Comment content

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "issue_number": 123,
  "body": "Thanks for reporting this issue!"
}
```

### 17. `list_issue_types`
List supported issue types for repository owner (organization).

**Parameters:**
- `owner` (required) - Organization owner

**Example:**
```json
{
  "owner": "facebook"
}
```

### 18. `sub_issue_write`
Add, remove, or reprioritize sub-issues.

**Parameters:**
- `method` (required) - Action: add, remove, reprioritize
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `issue_number` (required) - Parent issue number
- `sub_issue_id` (required) - Sub-issue ID
- `replace_parent` (optional) - Replace current parent (for add)
- `after_id` (optional) - Prioritize after this ID
- `before_id` (optional) - Prioritize before this ID

**Example:**
```json
{
  "method": "add",
  "owner": "myuser",
  "repo": "myrepo",
  "issue_number": 100,
  "sub_issue_id": 101
}
```

---

## Pull Request Operations

### 19. `list_pull_requests`
List pull requests in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `state` (optional) - Filter by state: open, closed, all
- `head` (optional) - Filter by head user/org and branch
- `base` (optional) - Filter by base branch
- `sort` (optional) - Sort by: created, updated, popularity, long-running
- `direction` (optional) - Sort direction: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "state": "open",
  "sort": "created",
  "direction": "desc"
}
```

### 20. `search_pull_requests`
Search for pull requests in GitHub repositories.

**Parameters:**
- `query` (required) - Search query
- `owner` (optional) - Repository owner
- `repo` (optional) - Repository name
- `sort` (optional) - Sort field
- `order` (optional) - Sort order: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "query": "is:open author:gaearon",
  "owner": "facebook",
  "repo": "react",
  "sort": "created"
}
```

### 21. `pull_request_read`
Get information on a specific pull request.

**Parameters:**
- `method` (required) - Action: get, get_diff, get_status, get_files, get_review_comments, get_reviews, get_comments
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "method": "get",
  "owner": "facebook",
  "repo": "react",
  "pullNumber": 456
}
```

### 22. `create_pull_request`
Create a new pull request.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `title` (required) - PR title
- `head` (required) - Branch containing changes
- `base` (required) - Branch to merge into
- `body` (optional) - PR description
- `draft` (optional) - Create as draft PR
- `maintainer_can_modify` (optional) - Allow maintainer edits

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "title": "Add new feature",
  "head": "feature/new-feature",
  "base": "main",
  "body": "This PR adds a new feature...",
  "draft": false
}
```

### 23. `update_pull_request`
Update an existing pull request.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `title` (optional) - New title
- `body` (optional) - New description
- `state` (optional) - New state: open, closed
- `base` (optional) - New base branch
- `draft` (optional) - Mark as draft
- `maintainer_can_modify` (optional) - Allow maintainer edits
- `reviewers` (optional) - GitHub usernames to request reviews from

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 456,
  "title": "Updated: Add new feature",
  "reviewers": ["reviewer1", "reviewer2"]
}
```

### 24. `merge_pull_request`
Merge a pull request.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `merge_method` (optional) - Method: merge, squash, rebase
- `commit_title` (optional) - Title for merge commit
- `commit_message` (optional) - Extra detail for merge commit

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 456,
  "merge_method": "squash",
  "commit_title": "Add new feature (#456)"
}
```

### 25. `update_pull_request_branch`
Update PR branch with latest changes from base branch.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `expectedHeadSha` (optional) - Expected SHA of PR's HEAD ref

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 456
}
```

---

## Review Operations

### 26. `pull_request_review_write`
Create, submit, or delete a pull request review.

**Parameters:**
- `method` (required) - Action: create, submit_pending, delete_pending
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `body` (optional) - Review comment text
- `event` (optional) - Review action: APPROVE, REQUEST_CHANGES, COMMENT
- `commitID` (optional) - SHA of commit to review

**Example:**
```json
{
  "method": "create",
  "owner": "facebook",
  "repo": "react",
  "pullNumber": 456,
  "body": "Looks good to me!",
  "event": "APPROVE"
}
```

### 27. `add_comment_to_pending_review`
Add review comment to pending pull request review.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number
- `path` (required) - File path
- `body` (required) - Comment text
- `subjectType` (required) - Target level: FILE, LINE
- `line` (optional) - Line number
- `side` (optional) - Side of diff: LEFT, RIGHT
- `startLine` (optional) - First line for multi-line comments
- `startSide` (optional) - Starting side for multi-line comments

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "pullNumber": 456,
  "path": "src/App.js",
  "body": "Consider using const instead of let here",
  "subjectType": "LINE",
  "line": 42,
  "side": "RIGHT"
}
```

### 28. `request_copilot_review`
Request GitHub Copilot code review for a pull request.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `pullNumber` (required) - Pull request number

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 456
}
```

---

## Search Operations

### 29. `search_code`
Fast code search across ALL GitHub repositories.

**Parameters:**
- `query` (required) - Search query
- `sort` (optional) - Sort field (indexed only)
- `order` (optional) - Sort order: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "query": "function useState language:javascript",
  "sort": "indexed",
  "order": "desc"
}
```

### 30. `search_users`
Find GitHub users by username, real name, or profile information.

**Parameters:**
- `query` (required) - User search query
- `sort` (optional) - Sort by: followers, repositories, joined
- `order` (optional) - Sort order: asc, desc
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "query": "location:seattle followers:>100",
  "sort": "followers",
  "order": "desc"
}
```

---

## User Operations

### 31. `get_me`
Get details of the authenticated GitHub user.

**Parameters:** None

**Example:**
```json
{}
```

### 32. `get_teams`
Get details of teams the user is a member of.

**Parameters:**
- `user` (optional) - Username (defaults to authenticated user)

**Example:**
```json
{
  "user": "octocat"
}
```

### 33. `get_team_members`
Get member usernames of a specific team.

**Parameters:**
- `org` (required) - Organization login
- `team_slug` (required) - Team slug

**Example:**
```json
{
  "org": "facebook",
  "team_slug": "react-core"
}
```

---

## Release Operations

### 34. `list_releases`
List releases in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "perPage": 20
}
```

### 35. `get_latest_release`
Get the latest release in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react"
}
```

### 36. `get_release_by_tag`
Get a specific release by its tag name.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `tag` (required) - Tag name (e.g., 'v1.0.0')

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "tag": "v18.0.0"
}
```

---

## Tag Operations

### 37. `list_tags`
List git tags in a GitHub repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `page` (optional) - Page number (min 1)
- `perPage` (optional) - Results per page (min 1, max 100)

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "perPage": 50
}
```

### 38. `get_tag`
Get details about a specific git tag.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `tag` (required) - Tag name

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "tag": "v18.0.0"
}
```

---

## Label Operations

### 39. `get_label`
Get a specific label from a repository.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `name` (required) - Label name

**Example:**
```json
{
  "owner": "facebook",
  "repo": "react",
  "name": "bug"
}
```

### 40. `create_workspace_tags`
Add tags to a Terraform workspace (if using Terraform integration).

**Parameters:**
- `terraform_org_name` (required) - Organization name
- `workspace_name` (required) - Workspace name
- `tags` (required) - Comma-separated tag names

**Example:**
```json
{
  "terraform_org_name": "my-org",
  "workspace_name": "production",
  "tags": "production,critical,monitored"
}
```

### 41. `read_workspace_tags`
Read all tags from a Terraform workspace.

**Parameters:**
- `terraform_org_name` (required) - Organization name
- `workspace_name` (required) - Workspace name

**Example:**
```json
{
  "terraform_org_name": "my-org",
  "workspace_name": "production"
}
```

---

## GitHub Copilot Operations

### 42. `assign_copilot_to_issue`
Assign GitHub Copilot to work on a specific issue.

**Parameters:**
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `issue_number` (required) - Issue number
- `base_ref` (optional) - Git reference to start from
- `custom_instructions` (optional) - Additional guidance for Copilot

**Example:**
```json
{
  "owner": "myuser",
  "repo": "myrepo",
  "issue_number": 123,
  "base_ref": "main",
  "custom_instructions": "Please follow our coding standards"
}
```

---

## Advanced Operations

### 43. `list_code_definition_names`
List definition names (classes, functions, methods) from source code.

**Parameters:**
- `path` (required) - File or directory path

**Example:**
```json
{
  "path": "src/components"
}
```

### 44. `obtain_git_diff`
Get git differences between branches or working directory.

**Parameters:**
- `path` (optional) - Specific file or directory
- `branch` (optional) - Branch to compare against
- `local_changes` (optional) - Include uncommitted changes

**Example:**
```json
{
  "branch": "main",
  "local_changes": true
}
```

### 45. `fetch_github_issue`
Fetch and analyze GitHub issues with local changes alignment.

**Parameters:**
- `issue_number` (optional) - Specific issue number
- `issue_url` (optional) - Direct GitHub issue URL
- `remote` (optional) - Remote repository name
- `cwd` (optional) - Working directory
- `search_assigned` (optional) - Search across assigned issues
- `list_current_repo` (optional) - List open issues in current repo

**Example:**
```json
{
  "issue_url": "https://github.com/facebook/react/issues/12345"
}
```

### 46. `generate_description_from_diff`
Generate PR description from diff between branches.

**Parameters:**
- `head` (required) - Branch with changes
- `base` (required) - Target branch
- `remote` (optional) - Remote repository name
- `cwd` (optional) - Working directory
- `template_index` (optional) - PR template index

**Example:**
```json
{
  "head": "feature/new-feature",
  "base": "main",
  "remote": "origin"
}
```

### 47. `create_pull_request` (Enhanced)
Create pull request with generated description.

**Parameters:**
- `head` (required) - Branch with changes
- `base` (required) - Target branch
- `title` (required) - PR title
- `remote` (required) - Remote repository name
- `body` (optional) - PR description
- `draft` (optional) - Create as draft
- `maintainer_can_modify` (optional) - Allow maintainer modifications
- `cwd` (optional) - Working directory

**Example:**
```json
{
  "head": "feature/new-feature",
  "base": "main",
  "title": "Add new feature",
  "remote": "origin",
  "draft": false
}
```

---

## Tips and Best Practices

### 1. **Pagination**
- Always use pagination for large result sets
- Default page size is often 30, max is usually 100
- Use `page` and `perPage` parameters consistently

### 2. **Search Queries**
- Use GitHub's search syntax for powerful queries
- Combine multiple filters: `is:open label:bug language:python`
- Use operators: `stars:>1000`, `created:>2023-01-01`

### 3. **Rate Limiting**
- Be mindful of GitHub API rate limits
- Authenticated requests have higher limits
- Use pagination to avoid hitting limits

### 4. **Error Handling**
- Always check for errors in responses
- Handle common errors: 404 (not found), 403 (forbidden), 422 (validation)
- Retry with exponential backoff for rate limit errors

### 5. **Security**
- Never expose tokens in code or logs
- Use environment variables for sensitive data
- Limit token permissions to minimum required

---

## Common Use Cases

### Creating a Complete Workflow

```json
// 1. Create a branch
{
  "owner": "myuser",
  "repo": "myrepo",
  "branch": "feature/new-feature",
  "from_branch": "main"
}

// 2. Push files
{
  "owner": "myuser",
  "repo": "myrepo",
  "branch": "feature/new-feature",
  "files": [
    {"path": "src/feature.js", "content": "..."}
  ],
  "message": "Add new feature"
}

// 3. Create pull request
{
  "owner": "myuser",
  "repo": "myrepo",
  "title": "Add new feature",
  "head": "feature/new-feature",
  "base": "main",
  "body": "This PR adds..."
}

// 4. Request review
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 123,
  "reviewers": ["reviewer1"]
}

// 5. Merge PR
{
  "owner": "myuser",
  "repo": "myrepo",
  "pullNumber": 123,
  "merge_method": "squash"
}
```

---

## Resources

- **GitHub API Documentation:** https://docs.github.com/en/rest
- **GitHub Search Syntax:** https://docs.github.com/en/search-github/searching-on-github
- **GitHub MCP Server:** https://github.com/github/github-mcp-server

---

**Last Updated:** April 8, 2026  
**Version:** 1.0  
**Author:** IBM Bob