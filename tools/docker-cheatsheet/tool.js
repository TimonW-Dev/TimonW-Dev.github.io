// Block: optional heading, rows [command, comment?] and optional note.
// Text between backticks is rendered as <code>; all text is inserted via textContent.
const compact = [
  ['docker run -d --name <name> <image>', 'Start a container'],
  ['docker ps -a', 'List all containers'],
  ['docker exec -it <container> sh', 'Open a shell'],
  ['docker logs -f <container>', 'Follow logs'],
  ['docker stop <container>', 'Stop'],
  ['docker image build -t <name>:<tag> .', 'Build an image'],
  ['docker compose up -d', 'Start services'],
  ['docker compose down', 'Stop and remove services'],
  ['docker system prune', 'Clean up unused data'],
];

const sections = [
  {
    title: 'Containers: create & start',
    blocks: [
      {
        rows: [['docker run [OPTIONS] IMAGE [COMMAND] [ARGS...]']],
      },
      {
        heading: 'Common options',
        rows: [
          ['-i', 'Keep stdin open'],
          ['-t', 'Allocate a pseudo-terminal'],
          ['-d', 'Run in the background'],
          ['-it', 'Interactive shell'],
          ['--name <name>', 'Container name'],
          ['-p <host-port>:<container-port>', 'Port mapping'],
          ['-v <source>:<target>', 'Volume / bind mount'],
          ['-e <KEY>=<VALUE>', 'Environment variable'],
          ['--rm', 'Remove automatically when it exits'],
          ['--restart <policy>', 'Restart policy'],
          ['--network <network>', 'Attach to a network'],
          ['-w <path>', 'Working directory'],
        ],
      },
      {
        heading: '`--restart <policy>`',
        rows: [
          ['no', 'Never restart automatically'],
          ['always', 'Always restart'],
          ['unless-stopped', 'Restart unless stopped manually'],
          ['on-failure[:<N>]', 'Restart on error, optionally max. N times'],
        ],
      },
      {
        heading: 'Combining flags',
        rows: [
          ['-it', 'Interactive with terminal'],
          ['-d', 'Background'],
          ['-itd', 'Interactive + terminal + background'],
        ],
        note: '`-it` and `-d` are usually used as alternatives. `-itd` works, but is rarely needed for a normal interactive shell.',
      },
    ],
  },
  {
    title: 'Containers: manage',
    blocks: [
      {
        rows: [
          ['docker ps', 'Running containers'],
          ['docker ps -a', 'All containers'],
          ['docker ps -q', 'Container IDs only'],
        ],
      },
      {
        rows: [
          ['docker start <container>'],
          ['docker stop <container>'],
          ['docker restart <container>'],
        ],
      },
      {
        rows: [
          ['docker exec -it <container> bash', 'Open an interactive bash shell'],
          ['docker exec -it <container> sh', 'Alternative if bash is not installed'],
          ['docker exec <container> <command>', 'Run a single command'],
        ],
      },
      {
        rows: [
          ['docker logs <container>', 'Show logs'],
          ['docker inspect <container>', 'Show details'],
          ['docker stats [container...]', 'Resource usage'],
        ],
      },
      {
        rows: [
          ['docker rm <container>', 'Remove a stopped container'],
          ['docker rm -f <container>', 'Force removal (also running)'],
          ['docker container prune', 'Remove all stopped containers'],
        ],
        note: '**Terminal tip:** `docker exec -it <container> bash` opens an interactive shell in a running container. `bash` must be installed in the image; slim images such as Alpine usually only have `sh`.',
      },
    ],
  },
  {
    title: 'Containers: logs',
    blocks: [
      {
        rows: [
          ['docker logs <container>', 'All available logs'],
          ['docker logs -f <container>', 'Follow live'],
          ['docker logs --tail <N> <container>', 'Last N lines'],
          ['docker logs --since <duration> <container>', 'Since a duration ago'],
          ['docker logs --until <timestamp> <container>', 'Up to a point in time'],
          ['docker logs -t <container>', 'Show timestamps'],
        ],
      },
      {
        heading: 'Examples',
        rows: [
          ['docker logs -f --tail 100 <container>', 'Last 100 lines + live'],
          ['docker logs --since 10m <container>', 'Last 10 minutes'],
        ],
        note: '`<duration>` e.g. `10m`, `1h`; `<timestamp>` e.g. `2026-10-26T12:00:00`.',
      },
    ],
  },
  {
    title: 'Images',
    blocks: [
      {
        rows: [
                  ['docker image build -t <name>:<tag> <build-context>', 'Build an image'],
          ['docker image build -t <name>:<tag> -f <Dockerfile> <build-context>', 'Build with a specific Dockerfile'],
          ['docker image tag <source-image> <target-image>', 'Add another tag'],
          ['docker image rm <image>', 'Remove an image'],
          ['docker image prune', 'Remove dangling (untagged) images'],
          ['docker image prune -a', 'Remove all unused images'],
        ],
      },
      {
        heading: 'Build options',
        rows: [
          ['-t <name>:<tag>', 'Name and tag the image'],
          ['-f <file>', 'Specify the Dockerfile'],
          ['--no-cache', 'Do not use the build cache'],
        ],
        note: '`<build-context>` is usually `.` (the current directory).',
      },
    ],
  },
  {
    title: 'Volumes',
    blocks: [
      {
        rows: [
          ['docker volume ls'],
          ['docker volume create <name>'],
          ['docker volume inspect <volume>'],
          ['docker volume rm <volume>'],
          ['docker volume prune', 'Remove unused anonymous volumes'],
          ['docker volume prune -a', 'Remove all unused volumes'],
        ],
      },
      {
        heading: 'Mounts with `docker run`',
        rows: [
          ['-v <host-path>:<container-path>', 'Bind mount'],
          ['-v <volume-name>:<container-path>', 'Named volume'],
          ['-v <source>:<target>:ro', 'Read-only mount'],
        ],
      },
      {
        heading: 'Alternative with `--mount`',
        rows: [
          ['--mount type=bind,source=<host-path>,target=<container-path>'],
          ['--mount type=volume,source=<volume-name>,target=<container-path>'],
        ],
        note: '**Bind mount:** directory or file from the host. **Volume:** persistent data managed by Docker.',
      },
    ],
  },
  {
    title: 'Networks',
    blocks: [
      {
        rows: [
          ['docker network ls'],
          ['docker network create <name>'],
          ['docker network inspect <network>'],
          ['docker network connect <network> <container>'],
          ['docker network disconnect <network> <container>'],
          ['docker network rm <network>'],
          ['docker network prune', 'Remove unused networks'],
        ],
      },
    ],
  },
  {
    title: 'Docker Compose',
    blocks: [
      {
        rows: [
          ['docker compose up', 'Start services'],
          ['docker compose up -d', 'In the background'],
          ['docker compose up --build -d', 'Build images and start'],
          ['docker compose down', 'Remove containers & networks'],
          ['docker compose down -v', 'Also remove volumes'],
          ['docker compose ps', 'Show status'],
          ['docker compose logs <service>', 'Logs of a service'],
          ['docker compose logs -f --tail 100', 'Last 100 lines + live'],
          ['docker compose build [service...]', 'Build images'],
          ['docker compose exec <service> <cmd>', 'Run a command in a running service'],
        ],
      },
    ],
  },
  {
    title: 'Cleanup',
    blocks: [
      {
        rows: [
          ['docker container prune', 'Stopped containers'],
          ['docker image prune', 'Dangling images'],
          ['docker image prune -a', 'All unused images'],
          ['docker volume prune', 'Unused anonymous volumes'],
          ['docker volume prune -a', 'All unused volumes'],
          ['docker network prune', 'Unused networks'],
        ],
      },
      {
        rows: [
          ['docker system prune', 'Stopped containers, unused networks, dangling images, build cache'],
          ['docker system prune -a', 'Additionally all unused images'],
          ['docker system prune -a --volumes', 'Additionally unused anonymous volumes'],
          ['docker system df', 'Disk usage'],
          ['docker system df -v', 'Detailed disk usage'],
        ],
      },
      {
        heading: 'Common optional flags',
        rows: [
          ['-f', 'Force / no confirmation prompt'],
          ['-a', 'All / additional resources, depending on the command'],
          ['-q', 'Print IDs only'],
        ],
        note: '**Warning:** `docker compose down -v`, `docker volume prune -a` and `docker system prune -a --volumes` can delete persistent data. Check your volumes before cleaning up.',
        warn: true,
      },
    ],
  },
  {
    title: 'Placeholders',
    blocks: [
      {
        rows: [
          ['<container>', 'Container name or ID'],
          ['<image>', 'Image name, optionally with `:tag`'],
          ['<name>', 'Freely chosen name'],
          ['<N>', 'Number, e.g. `100`'],
          ['<source>:<target>', 'Source on host/volume and target in the container'],
          ['[OPTIONS]', 'Optional parameters'],
          ['[ARGS...]', 'Optional further arguments'],
        ],
        note: '**Remember:** Container = instance · Image = template · Volume = persistent data',
      },
    ],
  },
  {
    title: 'Linux: run Docker without sudo',
    className: 'cs-linux-permissions',
    blocks: [
      {
        rows: [
          ['sudo usermod -aG docker $USER', 'Add the current user to the docker group'],
          ['newgrp docker', 'Apply the group change in the current shell'],
        ],
        note: 'Alternatively, log out and back in for the group change to take effect. The `docker` group grants root-level privileges; only add trusted users.',
        warn: true,
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
    const note = document.createElement('span');
    note.className = 'cs-comment';
    if (comment) appendRich(note, comment);
    list.append(code, note);
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
  title: 'Docker Cheatsheet',
  description: 'The most essential Docker commands. Open the tool page for the full cheatsheet.',
  tags: ['docker', 'cheatsheet', 'container', 'image', 'volume', 'network', 'compose', 'cli', 'prune', 'logs'],
  render(el) {
    const root = document.createElement('div');
    root.className = 'docker-cheatsheet';

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
      if (section.className) wrap.classList.add(section.className);
      const title = document.createElement('h2');
      title.textContent = section.title;
      wrap.append(title, ...section.blocks.map(buildBlock));
      root.append(wrap);
    }
    el.append(root);
  },
};
