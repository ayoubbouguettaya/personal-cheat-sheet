import { Injectable } from '@nestjs/common';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import simpleGit, { DefaultLogFields, SimpleGit } from 'simple-git';

import { SaveDataDto } from './dto/save-data.dto';
import { GetHistoryPaginationDto } from './dto/get-history-pagination.dto';
import { parse, stringify } from 'yaml'

const BASE_DIR = "/opt/myapp/repo";

const FileName = "setting.yaml";

const getFilePath = () => (join(BASE_DIR, FileName))


@Injectable()
export class AppService {
  private git: SimpleGit;

  constructor() {
    this.initialisation()
  }

  private async initialisation() {
    try {
      await mkdir(BASE_DIR, { recursive: true });
      this.git = simpleGit(BASE_DIR, { binary: 'git' });
      this.git.init()

    } catch (error) {
      console.log(error)
    }
  }

  async getData() {
    // js0n stringify parsed yam1
    return JSON.stringify(parse(await readFile(getFilePath(), "utf-8"))) 
  }

  async saveData(saveDataDto: SaveDataDto) {
    const { data, commitMessage, author } = saveDataDto;
    console.log("inside[saveData] service",saveDataDto)
    
        // yam1 stringify parsed json
    await writeFile(getFilePath(), stringify(JSON.parse(data)));
    await this.git.addConfig('user.name', author || 'unkown');
    await this.git.addConfig('user.email', `${author}@foobarz.blog`);

    await this.git.add('.');
    await this.git.commit(commitMessage);

    return 'ok';
  }

  async getCommitHistory(pagination: GetHistoryPaginationDto) {
    const {
      size = 10,
      page = 1,
    } = pagination;

    const query: string[] = [];
    const fileName = getFilePath()

    const { total: totalCount } = await this.git.log<DefaultLogFields>([
      ...query,
      '--',
      fileName,
    ]);

    const { all: commits, total: pageLength } =
      await this.git.log<DefaultLogFields>([
        `--max-count=${size}`,
        `--skip=${(page - 1) * size}`,
        ...query,
        '--',
        fileName,
      ]);

    const maxPages = Math.ceil(totalCount / size);

    return {
      items: commits,
      pageLength: pageLength,
      page: page,
      maxPages: maxPages,
      size: size,
      totalCount,
    };
  }

  async getChangesAndDataStateByCommit(commitHash: string) {
    try {
      console.log('[getChangesAndDataStateByCommit] commitHash', commitHash)
      const pathfileName = getFilePath();

      const data = await this.git.show([`${commitHash}:${FileName}`]);
      const changes = await this.git.show([commitHash, '--pretty=format:%b', '--', pathfileName]);

      return { data, changes }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  rollBack(commitHash: string) {
    /* 
    I found that the answer in stackoverflow is awesome and we can easly build uppon that logic

    Link : https://stackoverflow.com/questions/1463340/how-can-i-revert-multiple-git-commits

Expanding what I wrote in a comment

The general rule is that you should not rewrite (change) history that you have published, because somebody might have based their work on it. If you rewrite (change) history, you would make problems with merging their changes and with updating for them.

So the solution is to create a new commit which reverts changes that you want to get rid of. You can do this using git revert command.

You have the following situation:

A <-- B  <-- C <-- D                                  <-- master <-- HEAD

(arrows here refers to the direction of the pointer: the "parent" reference in the case of commits, the top commit in the case of branch head (branch ref), and the name of branch in the case of HEAD reference).

What you need to create is the following:

A <-- B  <-- C <-- D <-- [(BCD)-1]                   <-- master <-- HEAD

where [(BCD)^-1] means the commit that reverts changes in commits B, C, D. Mathematics tells us that (BCD)-1 = D-1 C-1 B-1, so you can get the required situation using the following commands:

$ git revert --no-commit D
$ git revert --no-commit C
$ git revert --no-commit B
$ git commit -m "the commit message for all of them"

Works for everything except merge commits.

Alternate solution would be to checkout contents of commit A, and commit this state. Also works with merge commits. Added files will not be deleted, however. If you have any local changes git stash them first:

$ git checkout -f A -- . # checkout that revision over the top of local files
$ git commit -a

Then you would have the following situation:

A <-- B  <-- C <-- D <-- A'                       <-- master <-- HEAD

The commit A' has the same contents as commit A, but is a different commit (commit message, parents, commit date).

Alternate solution by Jeff Ferland, modified by Charles Bailey builds upon the same idea, but uses git reset. Here it is slightly modified, this way WORKS FOR EVERYTHING:

$ git reset --hard A
$ git reset --soft D # (or ORIG_HEAD or @{1} [previous location of HEAD]), all of which are D
$ git commit
    */
    return 'Rollback is not implemnted yet!';
  }
}
