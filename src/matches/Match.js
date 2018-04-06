const Asset = require('./Asset');
const Roster = require('./Roster');

class Match {
    constructor(content, client, included) {
        Object.defineProperty(this, 'client', { value: client });

        if (typeof content === 'string') {
            this.id = content;
            this.full = false;
            return;
        }

        this.id = content.id;
        this.full = true;
        this.attributes = {
            createdAt: new Date(content.attributes.createdAt),
            duration: content.attributes.duration,
            gameMode: content.attributes.gameMode,
            patchVersion: content.attributes.patchVersion,
            shardId: content.attributes.shardId,
            stats: content.attributes.stats,
            tags: content.attributes.tags,
            titleId: content.attributes.titleId,
        };
        this.relationships = {
            assets: content.relationships.assets.data.map(p => new Asset(included.find(i => i.type === 'asset' && i.id === p.id), included)),
            // eslint-disable-next-line
            rosters: content.relationships.rosters.data.map(p => new Roster(included.find(i => i.type === 'roster' && i.id === p.id), included)),
            // Currently unused by API
            rounds: content.relationships.rounds.data,
            spectators: content.relationships.spectators.data,
        };
    }

    fetch() {
        return this.client.getMatch(this.id)
            .catch(e => Promise.reject(e));
    }
}

module.exports = Match;