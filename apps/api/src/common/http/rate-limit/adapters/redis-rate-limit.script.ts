/**
 * Atomically counts a hit in a fixed window and blocks the key once the limit
 * is exceeded. When the block ends, counting starts again from zero.
 *
 * KEYS: hits key, block key. ARGV: ttl ms, limit, block duration ms.
 * Returns: total hits, ms until the window resets, 1 if blocked, ms until the
 * block ends.
 */
export const INCREMENT_RATE_LIMIT_HITS_SCRIPT = `
local hitsKey = KEYS[1]
local blockKey = KEYS[2]
local ttl = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local blockDuration = tonumber(ARGV[3])

local remainingBlock = redis.call('PTTL', blockKey)
if remainingBlock > 0 then
  return { limit + 1, remainingBlock, 1, remainingBlock }
end

local totalHits = redis.call('INCR', hitsKey)
local remainingWindow = redis.call('PTTL', hitsKey)
if remainingWindow < 0 then
  redis.call('PEXPIRE', hitsKey, ttl)
  remainingWindow = ttl
end

if totalHits > limit then
  redis.call('SET', blockKey, '1', 'PX', blockDuration)
  redis.call('DEL', hitsKey)
  return { totalHits, blockDuration, 1, blockDuration }
end

return { totalHits, remainingWindow, 0, 0 }
`;
