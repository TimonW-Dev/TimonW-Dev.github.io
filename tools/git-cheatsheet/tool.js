// Block: optional heading, rows [command, comment?] and optional note.
// Text between backticks is rendered as <code>; all text is inserted via textContent.
const compact = [
  ['git clone <url>', 'Download a repository'],
  ['git switch main', 'Switch to main'],
  ['git switch -c <branch>', 'Create and switch to a new branch'],
  ['git add .', 'Stage all changes'],
  ['git commit -m "<message>"', 'Commit locally'],
  ['git push', 'Upload commits to GitHub'],
  ['git pull', 'Fetch and integrate upstream changes'],
  ['git merge <branch>', 'Merge a branch into the current one'],
  ['git status', 'Check the current state'],
];

const sections = [
  {
    title: 'One-time setup',
    blocks: [
      {
        rows: [
          ['git config --global user.name "Your Name"'],
          ['git config --global user.email "you@example.com"'],
        ],
        note: 'Replace the example name and email with your own.',
      },
    ],
  },
  {
    title: 'Clone a repository',
    blocks: [
      {
        rows: [
          ['git clone <url>', 'Download the repository'],
          ['cd <repo>', 'Enter the repository folder'],
        ],
        note: 'On GitHub, create a repository or open an existing one and copy the URL under **Code → HTTPS**. Replace `<url>` and `<repo>` with the URL and folder name, without the angle brackets.',
      },
    ],
  },
  {
    title: 'Standard workflow',
    blocks: [
      {
        heading: 'Update → edit → commit → push',
        rows: [
          ['git pull', 'Get the latest changes'],
          ['git status', 'Check the state'],
          ['git add .', 'Stage all changes'],
          ['git commit -m "<message>"', 'Commit locally'],
          ['git push', 'Upload to GitHub'],
        ],
        note: '**Note:** Run `git pull` before editing. If new changes appeared on GitHub in the meantime, `git pull --rebase` may be needed before the push.',
      },
      {
        rows: [
          ['git status', 'Check the state'],
          ['git diff', 'Show changes'],
          ['git add <file>', 'Stage a single file'],
          ['git add .', 'Stage all changes'],
          ['git commit -m "<message>"', 'Commit locally'],
          ['git pull', 'Fetch and integrate upstream changes'],
          ['git push', 'Upload commits to GitHub'],
          ['git log --oneline -10', 'Show the last 10 commits'],
        ],
      },
    ],
  },
  {
    title: 'Branches & pull requests',
    blocks: [
      {
        heading: 'Typical flow',
        rows: [
          ['git switch main', 'Go to the main branch'],
          ['git pull', 'Update main'],
          ['git switch -c <branch>', 'Create a new branch and switch to it'],
          ['git add .'],
          ['git commit -m "<message>"'],
          ['git push --set-upstream origin <branch>', 'Publish the branch'],
        ],
        note: 'Then create a **pull request** on GitHub and merge the changes into `main`. `--set-upstream` links the local branch to the remote branch; afterwards `git push` is usually enough.',
      },
      {
        rows: [
          ['git branch', 'List branches'],
          ['git branch -a', 'List local and remote branches'],
          ['git switch <branch>', 'Switch branch'],
          ['git switch -c <branch>', 'Create and switch'],
          ['git push --set-upstream origin <branch>', 'Push a new branch for the first time'],
          ['git branch -d <branch>', 'Delete a local branch (only if merged)'],
          ['git branch -D <branch>', 'Delete a local branch (force)'],
        ],
      },
    ],
  },
  {
    title: 'Merge',
    blocks: [
      {
        heading: 'Merge a branch into main locally',
        rows: [
          ['git switch main', 'Go to the target branch'],
          ['git pull', 'Update it first'],
          ['git merge <branch>', 'Merge <branch> into the current branch'],
          ['git push', 'Upload the result'],
        ],
        note: 'The merge always happens **into the branch you are currently on**. Alternatively, merge via a pull request on GitHub.',
      },
      {
        rows: [
          ['git merge --no-ff <branch>', 'Always create a merge commit'],
          ['git merge --abort', 'Cancel a merge with conflicts'],
          ['git branch --merged', 'List branches already merged'],
          ['git branch -d <branch>', 'Delete the merged branch'],
        ],
      },
      {
        heading: 'Merge conflict',
        rows: [
          ['git status', 'Show conflicted files'],
          ['git add <file>', 'Mark a file as resolved'],
          ['git commit', 'Finish the merge'],
        ],
        note: 'Open the conflicted files, resolve the sections between `<<<<<<<`, `=======` and `>>>>>>>`, then stage the files and commit.',
      },
    ],
  },
  {
    title: 'Undo changes',
    blocks: [
      {
        rows: [
          ['git diff', 'Review changes'],
          ['git restore <file>', 'Discard changes in a file'],
          ['git restore --staged <file>', 'Undo `git add`'],
          ['git reset --soft HEAD~1', 'Undo the last commit, keep the changes'],
        ],
        note: '**Caution:** `git restore <file>` discards unsaved changes of that file. `git reset --hard` can delete local changes permanently.',
        warn: true,
      },
      {
        heading: 'Case A: commit not pushed yet',
        rows: [['git reset --soft HEAD~1']],
        note: 'The last commit is removed. The changes stay staged and can be edited or committed again.',
      },
      {
        heading: 'Case B: commit already pushed to your own branch',
        rows: [
          ['git reset --soft HEAD~1'],
          ['git push --force-with-lease'],
        ],
        note: 'GitHub still points to the old commit, so the remote branch must be reset too. `--force-with-lease` refuses to overwrite changes made by others in the meantime. **Important:** only use it on your own branch.',
      },
      {
        heading: 'Case C: commit pushed to a shared branch',
        rows: [
          ['git revert HEAD'],
          ['git push'],
        ],
        note: '`git revert` creates a new commit that undoes the last commit. The history stays intact and no force push is needed.',
      },
    ],
  },
  {
    title: 'Common problems',
    blocks: [
      {
        rows: [
          ['nothing to commit', 'No new changes, or already committed'],
          ['rejected (push)', '`git pull --rebase`, then `git push`'],
          ['Wrong branch', '`git branch` to check, then `git switch main`'],
          ['File staged by mistake', '`git restore --staged <file>`'],
          ['No remote configured', '`git remote -v` to check'],
          ['Merge conflict', '`git status`, resolve the files, finish the merge or rebase step'],
        ],
      },
      {
        heading: 'Conflict during a rebase',
        rows: [
          ['git add <file>', 'After fixing the conflicts'],
          ['git rebase --continue', 'Continue with the next step'],
          ['git rebase --abort', 'Cancel the rebase'],
        ],
        note: 'Repeat for further conflicts, then push.',
      },
    ],
  },
  {
    title: 'GitHub connection',
    blocks: [
      {
        rows: [
          ['git remote -v', 'Show remote connections'],
          ['git remote add origin <url>', 'Add a remote'],
          ['git remote set-url origin <url>', 'Change the remote URL'],
          ['git branch -a', 'Show local and remote branches'],
        ],
      },
      {
        heading: 'Fetch vs. pull',
        rows: [
          ['git fetch', 'Fetch from the default remote without changing local branches'],
          ['git fetch --all', 'Fetch from all remotes without changing local branches'],
          ['git pull', 'Fetch and merge or rebase the current branch\'s upstream'],
        ],
        note: '`--all` means all remotes, not all local branches; remotes configured to skip fetch-all are excluded. `git pull` normally requires an upstream branch.',
      },
      {
        heading: 'Reset a local branch to match origin',
        rows: [
          ['git fetch origin', 'Fetch updates from the origin remote'],
          ['git reset --hard origin/<your-branch-name>', 'Reset the current branch and working files to match the remote branch'],
        ],
        note: '**Caution:** `git reset --hard` permanently discards uncommitted changes. Replace `<your-branch-name>` with the branch name.',
        warn: true,
      },
      {
        heading: 'Why fetch?',
        rows: [
          ['git log --oneline HEAD..@{u}', 'Show incoming commits'],
          ['git diff HEAD...@{u}', 'Show changes made upstream since the branches diverged'],
        ],
        note: '`git fetch` updates remote-tracking branches such as `origin/main` without changing your current branch or working files. This lets you inspect incoming changes before deciding whether to merge or rebase. Run these commands after fetching; `@{u}` refers to the current branch’s configured upstream.',
      },
    ],
  },
  {
    title: 'Important files',
    blocks: [
      {
        rows: [
          ['.git/config', 'Repository-local Git configuration'],
          ['~/.gitconfig', 'Global Git configuration for the current user'],
          ['.gitignore', 'Patterns for intentionally untracked files to ignore'],
        ],
        note: '`.gitignore` does not stop Git from tracking files that are already tracked.',
      },
    ],
  },
  {
    title: 'Quick reference',
    blocks: [
      {
        rows: [
          ['clone', 'Download a repository'],
          ['fetch', 'Download remote changes without integrating them'],
          ['pull', 'Fetch and integrate changes into the current branch'],
          ['add', 'Stage changes'],
          ['commit', 'Save changes locally'],
          ['push', 'Upload commits to GitHub'],
          ['switch', 'Switch branch'],
          ['merge', 'Combine branches'],
          ['status', 'Check the current state'],
          ['revert', 'Undo changes with a new commit'],
          ['reset', 'Move the local branch to an earlier commit'],
        ],
        note: '**Rule of thumb:** `pull` → edit → `add` → `commit` → `push`.',
      },
    ],
  },
];

// Splits `code` and **bold** markers into text nodes and elements.
function appendRich(parent, text) {
  for (const part of text.split(/(`[^`]*`|\*\*[^*]*\*\*)/)) {
    if (!part) continue;
    if (part.startsWith('`')) {
      const code = document.createElement('code');
      code.textContent = part.slice(1, -1);
      parent.append(code);
    } else if (part.startsWith('**')) {
      const strong = document.createElement('strong');
      strong.textContent = part.slice(2, -2);
      parent.append(strong);
    } else {
      parent.append(document.createTextNode(part));
    }
  }
}

function buildRows(rows) {
  const list = document.createElement('div');
  list.className = 'cs-rows';
  for (const [command, comment] of rows) {
    const code = document.createElement('code');
    code.className = 'cs-cmd';
    code.textContent = command;
    if (comment) {
      const note = document.createElement('span');
      note.className = 'cs-comment';
      appendRich(note, comment);
      list.append(code, note);
    } else {
      code.classList.add('cs-cmd-only');
      list.append(code);
    }
  }
  return list;
}

function buildBlock(block) {
  const el = document.createElement('div');
  el.className = 'cs-block';
  if (block.heading) {
    const heading = document.createElement('p');
    heading.className = 'cs-heading';
    appendRich(heading, block.heading);
    el.append(heading);
  }
  el.append(buildRows(block.rows));
  if (block.note) {
    const note = document.createElement('p');
    note.className = block.warn ? 'cs-note cs-warn' : 'cs-note';
    appendRich(note, block.note);
    el.append(note);
  }
  return el;
}

export default {
  title: 'Git & GitHub Cheatsheet',
  description: 'The most essential Git commands for everyday use. Open the tool page for the full cheatsheet.',
  tags: ['git', 'github', 'cheatsheet', 'clone', 'commit', 'push', 'pull', 'fetch', 'branch', 'merge', 'rebase', 'revert', 'reset', 'cli'],
  render(el) {
    const root = document.createElement('div');
    root.className = 'git-cheatsheet';

    // The tool page body carries .tool-page-body; the overview tile shows the short version.
    if (!el.classList.contains('tool-page-body')) {
      root.classList.add('cs-compact');
      root.append(buildRows(compact));
      el.append(root);
      return;
    }

    for (const section of sections) {
      const wrap = document.createElement('section');
      wrap.className = 'cs-section';
      const title = document.createElement('h2');
      title.textContent = section.title;
      wrap.append(title, ...section.blocks.map(buildBlock));
      root.append(wrap);
    }
    el.append(root);
  },
};
