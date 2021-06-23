/// <reference types="node" />

declare module "imapflow" {
    import { EventEmitter } from "events";

    /**
     * IMAP client class for accessing IMAP mailboxes
     * @param options - IMAP connection options
     * @param options.host - Hostname of the IMAP server
     * @param options.port - Port number for the IMAP server
     * @param [options.secure = false] - Should the connection be established over TLS.
     *      If `false` then connection is upgraded to TLS using STARTTLS extension before authentication
     * @param [options.servername] - Servername for SNI (or when host is set to an IP address)
     * @param [options.disableCompression = false] - if `true` then client does not try to use COMPRESS=DEFLATE extension
     * @param options.auth - Authentication options. Authentication is requested automatically during <code>connect()</code>
     * @param options.auth.user - Usename
     * @param [options.auth.pass] - Password, if using regular authentication
     * @param [options.auth.accessToken] - OAuth2 Access Token, if using OAuth2 authentication
     * @param [options.clientInfo] - Client identification info
     * @param [options.disableAutoIdle = false] - if `true` then IDLE is not started automatically. Useful if you only need to perform specific tasks over the connection
     * @param [options.tls] - Additional TLS options (see [Node.js TLS connect](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback) for all available options)
     * @param [options.tls.rejectUnauthorized = true] - if `false` then client accepts self-signed and expired certificates from the server
     * @param [options.tls.minVersion = TLSv1.2] - latest Node.js defaults to *'TLSv1.2'*, for older mail servers you might need to use something else, eg *'TLSv1'*
     * @param [options.tls.minDHSize = 1024] - Minimum size of the DH parameter in bits to accept a TLS connection
     * @param [options.logger] - Custom logger instance with `debug(obj)`, `info(obj)`, `warn(obj)` and `error(obj)` methods. If not provided then ImapFlow logs to console using pino format
     * @param [options.emitLogs = false] - If `true` then in addition of sending data to logger, ImapFlow emits 'log' events with the same data
     * @param [options.verifyOnly = false] - If `true` then logs out automatically after successful authentication
     */
    class ImapFlow extends EventEmitter {
        constructor(options: {
            host: string;
            port: number;
            secure?: boolean;
            servername?: string;
            disableCompression?: boolean;
            auth: {
                user: string;
                pass?: string;
                accessToken?: string;
            };
            clientInfo?: IdInfoObject;
            disableAutoIdle?: boolean;
            tls?: {
                rejectUnauthorized?: boolean;
                minVersion?: string;
                minDHSize?: number;
            };
            logger?: any;
            emitLogs?: boolean;
            verifyOnly?: boolean;
        });
        /**
         * Instance ID for logs
         */
        id: string;
        /**
         * Server identification info. Available after successful `connect()`.
         * If server does not provide identification info then this value is `null`.
         * @example
         * await client.connect();
         * console.log(client.serverInfo.vendor);
         */
        serverInfo: IdInfoObject | null;
        /**
         * Is the connection currently encrypted or not
         */
        secureConnection: boolean;
        /**
         * Active IMAP capabilities. Value is either `true` for togglabe capabilities (eg. `UIDPLUS`)
         * or a number for capabilities with a value (eg. `APPENDLIMIT`)
         */
        capabilities: Map<string, boolean | number>;
        /**
         * Enabled capabilities. Usually `CONDSTORE` and `UTF8=ACCEPT` if server supports these.
         */
        enabled: Set<string>;
        /**
         * Is the connection currently usable or not
         */
        usable: boolean;
        /**
         * Currently authenticated user or `false` if mailbox is not open
         * or `true` if connection was authenticated by PREAUTH
         */
        authenticated: string | boolean;
        /**
         * Currently selected mailbox or `false` if mailbox is not open
         */
        mailbox: MailboxObject | boolean;
        /**
         * Is current mailbox idling (`true`) or not (`false`)
         */
        idling: boolean;
        /**
         * If `true` then in addition of sending data to logger, ImapFlow emits 'log' events with the same data
         */
        emitLogs: boolean;
        /**
         * Initiates a connection against IMAP server. Throws if anything goes wrong. This is something you have to call before you can run any IMAP commands
         * @example
         * let client = new ImapFlow({...});
         * await client.connect();
         */
        connect(): Promise<void>;
        /**
         * Graceful connection close by sending logout command to server. TCP connection is closed once command is finished.
         * @example
         * let client = new ImapFlow({...});
         * await client.connect();
         * ...
         * await client.logout();
         */
        logout(): Promise<void>;
        /**
         * Closes TCP connection without notifying the server.
         * @example
         * let client = new ImapFlow({...});
         * await client.connect();
         * ...
         * client.close();
         */
        close(): void;
        /**
         * Returns current quota
         * @example
         * let quota = await client.getQuota();
         * console.log(quota.storage.used, quota.storage.available)
         * @param [path] - Optional mailbox path if you want to check quota for specific folder
         * @returns Quota information or `false` if QUTOA extension is not supported or requested path does not exist
         */
        getQuota(path?: string): Promise<QuotaResponse | Boolean>;
        /**
         * Lists available mailboxes as an Array
         * @example
         * let list = await client.list();
         * list.forEach(mailbox=>console.log(mailbox.path));
         * @returns An array of ListResponse objects
         */
        list(): Promise<ListResponse[]>;
        /**
         * Lists available mailboxes as a tree structured object
         * @example
         * let tree = await client.listTree();
         * tree.folders.forEach(mailbox=>console.log(mailbox.path));
         * @returns Tree structured object
         */
        listTree(): Promise<ListTreeResponse>;
        /**
         * Performs a no-op call against server
         */
        noop(): Promise<void>;
        /**
         * Creates a new mailbox folder and sets up subscription for the created mailbox. Throws on error.
         * @example
         * let info = await client.mailboxCreate(['parent', 'child']);
         * console.log(info.path);
         * // "INBOX.parent.child" // assumes "INBOX." as namespace prefix and "." as delimiter
         * @param path - Full mailbox path. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
         * @returns Mailbox info
         */
        mailboxCreate(path: string | any[]): Promise<MailboxCreateResponse>;
        /**
         * Renames a mailbox. Throws on error.
         * @example
         * let info = await client.mailboxRename('parent.child', 'Important stuff ❗️');
         * console.log(info.newPath);
         * // "INBOX.Important stuff ❗️" // assumes "INBOX." as namespace prefix
         * @param path - Path for the mailbox to rename. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
         * @param newPath - New path for the mailbox
         * @returns Mailbox info
         */
        mailboxRename(path: string | any[], newPath: string | any[]): Promise<MailboxRenameResponse>;
        /**
         * Deletes a mailbox. Throws on error.
         * @example
         * let info = await client.mailboxDelete('Important stuff ❗️');
         * console.log(info.path);
         * // "INBOX.Important stuff ❗️" // assumes "INBOX." as namespace prefix
         * @param path - Path for the mailbox to delete. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
         * @returns Mailbox info
         */
        mailboxDelete(path: string | any[]): Promise<MailboxDeleteResponse>;
        /**
         * Subscribes to a mailbox
         * @example
         * await client.mailboxSubscribe('Important stuff ❗️');
         * @param path - Path for the mailbox to subscribe to. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
         * @returns `true` if subscription operation succeeded, `false` otherwise
         */
        mailboxSubscribe(path: string | any[]): Promise<Boolean>;
        /**
         * Unsubscribes from a mailbox
         * @example
         * await client.mailboxUnsubscribe('Important stuff ❗️');
         * @param path - **Path for the mailbox** to unsubscribe from. Unicode is allowed. If value is an array then it is joined using current delimiter symbols. Namespace prefix is added automatically if required.
         * @returns `true` if unsubscription operation succeeded, `false` otherwise
         */
        mailboxUnsubscribe(path: string | any[]): Promise<Boolean>;
        /**
         * Opens a mailbox to access messages. You can perform message operations only against an opened mailbox.
         * Using {@link module:imapflow~ImapFlow#getMailboxLock|getMailboxLock()} instead of `mailboxOpen()` is preferred. Both do the same thing
         * but next `getMailboxLock()` call is not executed until previous one is released.
         * @example
         * let mailbox = await client.mailboxOpen('Important stuff ❗️');
         * console.log(mailbox.exists);
         * // 125
         * @param path - **Path for the mailbox** to open
         * @param [options] - optional options
         * @param [options.readOnly = false] - If `true` then opens mailbox in read-only mode. You can still try to perform write operations but these would probably fail.
         * @returns Mailbox info
         */
        mailboxOpen(path: string | any[], options?: {
            readOnly?: boolean;
        }): Promise<MailboxObject>;
        /**
         * Closes a previously opened mailbox
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * await client.mailboxClose();
         * @returns Did the operation succeed or not
         */
        mailboxClose(): Promise<Boolean>;
        /**
         * Requests the status of the indicated mailbox. Only requested status values will be returned.
         * @example
         * let status = await client.status('INBOX', {unseen: true});
         * console.log(status.unseen);
         * // 123
         * @param path - mailbox path to check for
         * @param query - defines requested status items
         * @param query.messages - if `true` request count of messages
         * @param query.recent - if `true` request count of messages with \\Recent tag
         * @param query.uidNext - if `true` request predicted next UID
         * @param query.uidValidity - if `true` request mailbox `UIDVALIDITY` value
         * @param query.unseen - if `true` request count of unseen messages
         * @param query.highestModseq - if `true` request last known modseq value
         * @returns status of the indicated mailbox
         */
        status(path: string, query: {
            messages: boolean;
            recent: boolean;
            uidNext: boolean;
            uidValidity: boolean;
            unseen: boolean;
            highestModseq: boolean;
        }): Promise<StatusObject>;
        /**
         * Starts listening for new or deleted messages from the currently opened mailbox. Only required if {@link ImapFlow#disableAutoIdle} is set to `true`
         * otherwise IDLE is started by default on connection inactivity. NB! If `idle()` is called manually then it does not
         * return until IDLE is finished which means you would have to call some other command out of scope.
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         *
         * await client.idle();
         * @returns Did the operation succeed or not
         */
        idle(): Promise<Boolean>;
        /**
         * Sets flags for a message or message range
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // mark all unseen messages as seen (and remove other flags)
         * await client.messageFlagsSet({seen: false}, ['\Seen]);
         * @param range - Range to filter the messages
         * @param Array - of flags to set. Only flags that are permitted to set are used, other flags are ignored
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @param [options.unchangedSince] - If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
         * @param [options.useLabels = false] - If true then update Gmail labels instead of message flags
         * @returns Did the operation succeed or not
         */
        messageFlagsSet(range: SequenceString | Number[] | SearchObject, Array: string[], options?: {
            uid?: boolean;
            unchangedSince?: bigint;
            useLabels?: boolean;
        }): Promise<Boolean>;
        /**
         * Adds flags for a message or message range
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // mark all unseen messages as seen (and keep other flags as is)
         * await client.messageFlagsAdd({seen: false}, ['\Seen]);
         * @param range - Range to filter the messages
         * @param Array - of flags to set. Only flags that are permitted to set are used, other flags are ignored
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @param [options.unchangedSince] - If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
         * @param [options.useLabels = false] - If true then update Gmail labels instead of message flags
         * @returns Did the operation succeed or not
         */
        messageFlagsAdd(range: SequenceString | Number[] | SearchObject, Array: string[], options?: {
            uid?: boolean;
            unchangedSince?: bigint;
            useLabels?: boolean;
        }): Promise<Boolean>;
        /**
         * Remove specific flags from a message or message range
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // mark all seen messages as unseen by removing \\Seen flag
         * await client.messageFlagsRemove({seen: true}, ['\Seen]);
         * @param range - Range to filter the messages
         * @param Array - of flags to remove. Only flags that are permitted to set are used, other flags are ignored
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @param [options.unchangedSince] - If set then only messages with a lower or equal `modseq` value are updated. Ignored if server does not support `CONDSTORE` extension.
         * @param [options.useLabels = false] - If true then update Gmail labels instead of message flags
         * @returns Did the operation succeed or not
         */
        messageFlagsRemove(range: SequenceString | Number[] | SearchObject, Array: string[], options?: {
            uid?: boolean;
            unchangedSince?: bigint;
            useLabels?: boolean;
        }): Promise<Boolean>;
        /**
         * Delete messages from currently opened mailbox. Method does not indicate info about deleted messages,
         * instead you should be using {@link ImapFlow#expunge} event for this
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // delete all seen messages
         * await client.messageDelete({seen: true});
         * @param range - Range to filter the messages
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @returns Did the operation succeed or not
         */
        messageDelete(range: SequenceString | Number[] | SearchObject, options?: {
            uid?: boolean;
        }): Promise<Boolean>;
        /**
         * Appends a new message to a mailbox
         * @example
         * await client.append('INBOX', rawMessageBuffer, ['\\Seen'], new Date(2000, 1, 1));
         * @param path - Mailbox path to upload the message to
         * @param content - RFC822 formatted email message
         * @param [flags] - an array of flags to be set for the uploaded message
         * @param [idate = now] - internal date to be set for the message
         * @returns info about uploaded message
         */
        append(path: string, content: string | Buffer, flags?: string[], idate?: Date | string): Promise<AppendResponseObject>;
        /**
         * Copies messages from current mailbox to destination mailbox
         * @example
         * await client.mailboxOpen('INBOX');
         * // copy all messages to a mailbox called "Backup" (must exist)
         * let result = await client.messageCopy('1:*', 'Backup');
         * console.log('Copied %s messages', result.uidMap.size);
         * @param range - Range of messages to copy
         * @param destination - Mailbox path to copy the messages to
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @returns info about copies messages
         */
        messageCopy(range: SequenceString | Number[] | SearchObject, destination: string, options?: {
            uid?: boolean;
        }): Promise<CopyResponseObject>;
        /**
         * Moves messages from current mailbox to destination mailbox
         * @example
         * await client.mailboxOpen('INBOX');
         * // move all messages to a mailbox called "Trash" (must exist)
         * let result = await client.messageMove('1:*', 'Trash');
         * console.log('Moved %s messages', result.uidMap.size);
         * @param range - Range of messages to move
         * @param destination - Mailbox path to move the messages to
         * @param [options.uid] - If `true` then uses UID {@link SequenceString} instead of sequence numbers
         * @returns info about moved messages
         */
        messageMove(range: SequenceString | Number[] | SearchObject, destination: string, options?: {
            uid?: boolean;
        }): Promise<CopyResponseObject>;
        /**
         * Search messages from currently opened mailbox
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // find all unseen messages
         * let list = await client.search({seen: false});
         * // use OR modifier (array of 2 or more search queries)
         * let list = await client.search({
         *   seen: false,
         *   or: [
         *     {flagged: true},
         *     {from: 'andris'},
         *     {subject: 'test'}
         *   ]});
         * @param query - Query to filter the messages
         * @param [options.uid] - If `true` then returns UID numbers instead of sequence numbers
         * @returns An array of sequence or UID numbers
         */
        search(query: SearchObject, options?: {
            uid?: boolean;
        }): Promise<Number[]>;
        /**
         * Fetch messages from currently opened mailbox
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // fetch UID for all messages in a mailbox
         * for await (let msg of client.fetch('1:*', {uid: true})){
         *     console.log(msg.uid);
         * }
         * @param range - Range of messages to fetch
         * @param query - Fetch query
         * @param [options.uid] - If `true` then uses UID numbers instead of sequence numbers for `range`
         * @param [options.changedSince] - If set then only messages with a higher modseq value are returned. Ignored if server does not support `CONDSTORE` extension.
         */
        fetch(range: SequenceString | Number[] | SearchObject, query: FetchQueryObject, options?: {
            uid?: boolean;
            changedSince?: bigint;
        }): void;
        /**
         * Fetch a single message from currently opened mailbox
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // fetch UID for all messages in a mailbox
         * let lastMsg = await client.fetchOne('*', {uid: true})
         * console.log(lastMsg.uid);
         * @param seq - Single UID or sequence number of the message to fetch for
         * @param query - Fetch query
         * @param [options.uid] - If `true` then uses UID number instead of sequence number for `seq`
         * @returns Message data object
         */
        fetchOne(seq: SequenceString, query: FetchQueryObject, options?: {
            uid?: boolean;
        }): Promise<FetchMessageObject>;
        /**
         * Download either full rfc822 formated message or a specific bodystructure part as a Stream.
         * Bodystructure parts are decoded so the resulting stream is a binary file. Text content
         * is automatically converted to UTF-8 charset.
         * @example
         * let mailbox = await client.mailboxOpen('INBOX');
         * // download body part nr '1.2' from latest message
         * let {meta, content} = await client.download('*', '1.2');
         * content.pipe(fs.createWriteStream(meta.filename));
         * @param range - UID or sequence number for the message to fetch
         * @param [part] - If not set then downloads entire rfc822 formatted message, otherwise downloads specific bodystructure part
         * @param [options.uid] - If `true` then uses UID number instead of sequence number for `range`
         * @param [options.maxBytes] - If set then limits download size to specified bytes
         * @returns Download data object
         */
        download(range: SequenceString, part?: string, options?: {
            uid?: boolean;
            maxBytes?: number;
        }): Promise<DownloadObject>;
        /**
         * Opens a mailbox if not already open and returns a lock. Next call to `getMailboxLock()` is queued
         * until previous lock is released. This is suggested over {@link module:imapflow~ImapFlow#mailboxOpen|mailboxOpen()} as
         * `getMailboxLock()` gives you a weak transaction while `mailboxOpen()` has no guarantees whatsoever that another
         * mailbox is opened while you try to call multiple fetch or store commands.
         * @example
         * let lock = await client.getMailboxLock('INBOX');
         * try {
         *   // do something in the mailbox
         * } finally {
         *   // use finally{} to make sure lock is released even if exception occurs
         *   lock.release();
         * }
         * @param path - **Path for the mailbox** to open
         * @param [options] - optional options
         * @param [options.readOnly = false] - If `true` then opens mailbox in read-only mode. You can still try to perform write operations but these would probably fail.
         * @returns Mailbox lock
         */
        getMailboxLock(path: string | any[], options?: {
            readOnly?: boolean;
        }): Promise<MailboxLockObject>;
    }
}

/**
 * @property path - mailbox path
 * @property delimiter - mailbox path delimiter, usually "." or "/"
 * @property flags - list of flags for this mailbox
 * @property [specialUse] - one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
 * @property listed - `true` if mailbox was found from the output of LIST command
 * @property subscribed - `true` if mailbox was found from the output of LSUB command
 * @property permanentFlags - A Set of flags available to use in this mailbox. If it is not set or includes special flag "\\\*" then any flag can be used.
 * @property [mailboxId] - unique mailbox ID if server has `OBJECTID` extension enabled
 * @property [highestModseq] - latest known modseq value if server has CONDSTORE or XYMHIGHESTMODSEQ enabled
 * @property uidValidity - Mailbox `UIDVALIDITY` value
 * @property uidNext - Next predicted UID
 * @property exists - Messages in this folder
 */
declare type MailboxObject = {
    path: string;
    delimiter: string;
    flags: Set<string>;
    specialUse?: string;
    listed: boolean;
    subscribed: boolean;
    permanentFlags: Set<string>;
    mailboxId?: string;
    highestModseq?: bigint;
    uidValidity: bigint;
    uidNext: number;
    exists: number;
};

/**
 * @example
 * let lock = await client.getMailboxLock('INBOX');
 * try {
 *   // do something in the mailbox
 * } finally {
 *   // use finally{} to make sure lock is released even if exception occurs
 *   lock.release();
 * }
 * @property path - mailbox path
 * @property release - Release current lock
 */
declare type MailboxLockObject = {
    path: string;
    release: (...params: any[]) => any;
};

/**
 * Client and server identification object, where key is one of RFC2971 defined [data fields](https://tools.ietf.org/html/rfc2971#section-3.3) (but not limited to).
 * @property [name] - Name of the program
 * @property [version] - Version number of the program
 * @property [os] - Name of the operating system
 * @property [vendor] - Vendor of the client/server
 * @property ['support-url'] - URL to contact for support
 * @property [date] - Date program was released
 */
declare type IdInfoObject = {
    name?: string;
    version?: string;
    os?: string;
    vendor?: string;
    'support-url'?: string;
    date?: Date;
};

/**
 * @property path - mailbox path this quota applies to
 * @property [storage] - Storage quota if provided by server
 * @property [storage.used] - used storage in bytes
 * @property [storage.limit] - total storage available
 * @property [messages] - Message count quota if provided by server
 * @property [messages.used] - stored messages
 * @property [messages.limit] - maximum messages allowed
 */
declare type QuotaResponse = {
    path: string;
    storage?: {
        used?: number;
        limit?: number;
    };
    messages?: {
        used?: number;
        limit?: number;
    };
};

/**
 * @property path - mailbox path
 * @property name - mailbox name (last part of path after delimiter)
 * @property delimiter - mailbox path delimiter, usually "." or "/"
 * @property flags - a set of flags for this mailbox
 * @property specialUse - one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
 * @property listed - `true` if mailbox was found from the output of LIST command
 * @property subscribed - `true` if mailbox was found from the output of LSUB command
 */
declare type ListResponse = {
    path: string;
    name: string;
    delimiter: string;
    flags: Set<string>;
    specialUse: string;
    listed: boolean;
    subscribed: boolean;
};

/**
 * @property root - If `true` then this is root node without any additional properties besides *folders*
 * @property path - mailbox path
 * @property name - mailbox name (last part of path after delimiter)
 * @property delimiter - mailbox path delimiter, usually "." or "/"
 * @property flags - list of flags for this mailbox
 * @property specialUse - one of special-use flags (if applicable): "\All", "\Archive", "\Drafts", "\Flagged", "\Junk", "\Sent", "\Trash". Additionally INBOX has non-standard "\Inbox" flag set
 * @property listed - `true` if mailbox was found from the output of LIST command
 * @property subscribed - `true` if mailbox was found from the output of LSUB command
 * @property disabled - If `true` then this mailbox can not be selected in the UI
 * @property folders - An array of subfolders
 */
declare type ListTreeResponse = {
    root: boolean;
    path: string;
    name: string;
    delimiter: string;
    flags: any[];
    specialUse: string;
    listed: boolean;
    subscribed: boolean;
    disabled: boolean;
    folders: ListTreeResponse[];
};

/**
 * @property path - full mailbox path
 * @property [mailboxId] - unique mailbox ID if server supports `OBJECTID` extension (currently Yahoo and some others)
 * @property created - If `true` then mailbox was created otherwise it already existed
 */
declare type MailboxCreateResponse = {
    path: string;
    mailboxId?: string;
    created: boolean;
};

/**
 * @property path - full mailbox path that was renamed
 * @property newPath - new full mailbox path
 */
declare type MailboxRenameResponse = {
    path: string;
    newPath: string;
};

/**
 * @property path - full mailbox path that was deleted
 */
declare type MailboxDeleteResponse = {
    path: string;
};

/**
 * @property path - full mailbox path that was checked
 * @property [messages] - Count of messages
 * @property [recent] - Count of messages with \\Recent tag
 * @property [uidNext] - Predicted next UID
 * @property [uidValidity] - Mailbox `UIDVALIDITY` value
 * @property [unseen] - Count of unseen messages
 * @property [highestModseq] - Last known modseq value (if CONDSTORE extension is enabled)
 */
declare type StatusObject = {
    path: string;
    messages?: number;
    recent?: number;
    uidNext?: number;
    uidValidity?: bigint;
    unseen?: number;
    highestModseq?: bigint;
};

/**
 * Sequence range string. Separate different values with commas, number ranges with colons and use \\* as the placeholder for the newest message in mailbox
 * @example
 * "1:*" // for all messages
 * "1,2,3" // for messages 1, 2 and 3
 * "1,2,4:6" // for messages 1,2,4,5,6
 * "*" // for the newest message
 */
declare type SequenceString = string;

/**
 * IMAP search query options. By default all conditions must match. In case of `or` query term at least one condition must match.
 * @property [seq] - message ordering sequence range
 * @property [answered] - Messages with (value is `true`) or without (value is `false`) \\Answered flag
 * @property [deleted] - Messages with (value is `true`) or without (value is `false`) \\Deleted flag
 * @property [draft] - Messages with (value is `true`) or without (value is `false`) \\Draft flag
 * @property [flagged] - Messages with (value is `true`) or without (value is `false`) \\Flagged flag
 * @property [seen] - Messages with (value is `true`) or without (value is `false`) \\Seen flag
 * @property [all] - If `true` matches all messages
 * @property [new] - If `true` matches messages that have the \\Recent flag set but not the \\Seen flag
 * @property [old] - If `true` matches messages that do not have the \\Recent flag set
 * @property [recent] - If `true` matches messages that have the \\Recent flag set
 * @property [from] - Matches From: address field
 * @property [to] - Matches To: address field
 * @property [cc] - Matches Cc: address field
 * @property [bcc] - Matches Bcc: address field
 * @property [body] - Matches message body
 * @property [subject] - Matches message subject
 * @property [larger] - Matches messages larger than value
 * @property [smaller] - Matches messages smaller than value
 * @property [uid] - UID sequence range
 * @property [modseq] - Matches messages with modseq higher than value
 * @property [emailId] - unique email ID. Only used if server supports `OBJECTID` or `X-GM-EXT-1` extensions
 * @property [threadId] - unique thread ID. Only used if server supports `OBJECTID` or `X-GM-EXT-1` extensions
 * @property [before] - Matches messages received before date
 * @property [on] - Matches messages received on date (ignores time)
 * @property [since] - Matches messages received after date
 * @property [sentBefore] - Matches messages sent before date
 * @property [sentOn] - Matches messages sent on date (ignores time)
 * @property [sentSince] - Matches messages sent after date
 * @property [keyword] - Matches messages that have the custom flag set
 * @property [unKeyword] - Matches messages that do not have the custom flag set
 * @property [header] - Mathces messages with header key set if value is `true` (**NB!** not supported by all servers) or messages where header partially matches a string value
 * @property [or] - An array of 2 or more {@link SearchObject} objects. At least on of these must match
 */
declare type SearchObject = {
    seq?: SequenceString;
    answered?: boolean;
    deleted?: boolean;
    draft?: boolean;
    flagged?: boolean;
    seen?: boolean;
    all?: boolean;
    new?: boolean;
    old?: boolean;
    recent?: boolean;
    from?: string;
    to?: string;
    cc?: string;
    bcc?: string;
    body?: string;
    subject?: string;
    larger?: number;
    smaller?: number;
    uid?: SequenceString;
    modseq?: bigint;
    emailId?: string;
    threadId?: string;
    before?: Date | string;
    on?: Date | string;
    since?: Date | string;
    sentBefore?: Date | string;
    sentOn?: Date | string;
    sentSince?: Date | string;
    keyword?: string;
    unKeyword?: string;
    header?: {
        [key: string]: Boolean | String;
    };
    or?: SearchObject[];
    and?: SearchObject[];
};

/**
 * @property path - full mailbox path where the message was uploaded to
 * @property [uidValidity] - mailbox `UIDVALIDITY` if server has `UIDPLUS` extension enabled
 * @property [uid] - UID of the uploaded message if server has `UIDPLUS` extension enabled
 * @property [seq] - sequence number of the uploaded message if path is currently selected mailbox
 */
declare type AppendResponseObject = {
    path: string;
    uidValidity?: bigint;
    uid?: number;
    seq?: number;
};

/**
 * @property path - path of source mailbox
 * @property destination - path of destination mailbox
 * @property [uidValidity] - destination mailbox `UIDVALIDITY` if server has `UIDPLUS` extension enabled
 * @property [uidMap] - Map of UID values (if server has `UIDPLUS` extension enabled) where key is UID in source mailbox and value is the UID for the same message in destination mailbox
 */
declare type CopyResponseObject = {
    path: string;
    destination: string;
    uidValidity?: bigint;
    uidMap?: Map<number, number>;
};

/**
 * @property [uid] - if `true` then include UID in the response
 * @property [flags] - if `true` then include flags Set in the response
 * @property [bodyStructure] - if `true` then include parsed BODYSTRUCTURE object in the response
 * @property [envelope] - if `true` then include parsed ENVELOPE object in the response
 * @property [internalDate] - if `true` then include internal date value in the response
 * @property [size] - if `true` then include message size in the response
 * @property [source] - if `true` then include full message in the response
 * @property [source.start] - include full message in the response starting from *start* byte
 * @property [source.maxLength] - include full message in the response, up to *maxLength* bytes
 * @property [threadId] - if `true` then include thread ID in the response (only if server supports either `OBJECTID` or `X-GM-EXT-1` extensions)
 * @property [labels] - if `true` then include GMail labels in the response (only if server supports `X-GM-EXT-1` extension)
 * @property [headers] - if `true` then includes full headers of the message in the response. If the value is an array of header keys then includes only headers listed in the array
 * @property [bodyParts] - An array of BODYPART identifiers to include in the response
 */
declare type FetchQueryObject = {
    uid?: boolean;
    flags?: boolean;
    bodyStructure?: boolean;
    envelope?: boolean;
    internalDate?: boolean;
    size?: boolean;
    source?: {
        start?: number;
        maxLength?: number;
    } | boolean;
    threadId?: string;
    labels?: boolean;
    headers?: boolean | string[];
    bodyParts?: string[];
};

/**
 * Parsed email address entry
 * @property [name] - name of the address object (unicode)
 * @property [address] - email address
 */
declare type MessageAddressObject = {
    name?: string;
    address?: string;
};

/**
 * Parsed IMAP ENVELOPE object
 * @property [date] - header date
 * @property [subject] - message subject (unicode)
 * @property [messageId] - Message ID of the message
 * @property [inReplyTo] - Message ID from In-Reply-To header
 * @property [from] - Array of addresses from the From: header
 * @property [sender] - Array of addresses from the Sender: header
 * @property [replyTo] - Array of addresses from the Reply-To: header
 * @property [to] - Array of addresses from the To: header
 * @property [cc] - Array of addresses from the Cc: header
 * @property [bcc] - Array of addresses from the Bcc: header
 */
declare type MessageEnvelopeObject = {
    date?: Date;
    subject?: string;
    messageId?: string;
    inReplyTo?: string;
    from?: MessageAddressObject[];
    sender?: MessageAddressObject[];
    replyTo?: MessageAddressObject[];
    to?: MessageAddressObject[];
    cc?: MessageAddressObject[];
    bcc?: MessageAddressObject[];
};

/**
 * Parsed IMAP BODYSTRUCTURE object
 * @property part - Body part number. This value can be used to later fetch the contents of this part of the message
 * @property type - Content-Type of this node
 * @property [parameters] - Additional parameters for Content-Type, eg "charset"
 * @property [id] - Content-ID
 * @property [encoding] - Transfer encoding
 * @property [size] - Expected size of the node
 * @property [envelope] - message envelope of embedded RFC822 message
 * @property [disposition] - Content disposition
 * @property [dispositionParameters] - Additional parameters for Conent-Disposition
 * @property childNodes - An array of child nodes if this is a multipart node. Not present for normal nodes
 */
declare type MessageStructureObject = {
    part: string;
    type: string;
    parameters?: any;
    id?: string;
    encoding?: string;
    size?: number;
    envelope?: MessageEnvelopeObject;
    disposition?: string;
    dispositionParameters?: any;
    childNodes: MessageStructureObject[];
};

/**
 * Fetched message data
 * @property seq - message sequence number. Always included in the response
 * @property uid - message UID number. Always included in the response
 * @property [source] - message source for the requested byte range
 * @property [modseq] - message Modseq number. Always included if the server supports CONDSTORE extension
 * @property [emailId] - unique email ID. Always included if server supports `OBJECTID` or `X-GM-EXT-1` extensions
 * @property [threadid] - unique thread ID. Only present if server supports `OBJECTID` or `X-GM-EXT-1` extension
 * @property [labels] - a Set of labels. Only present if server supports `X-GM-EXT-1` extension
 * @property [size] - message size
 * @property [flags] - a set of message flags
 * @property [envelope] - message envelope
 * @property [bodyStructure] - message body structure
 * @property [internalDate] - message internal date
 * @property [bodyParts] - a Map of message body parts where key is requested part identifier and value is a Buffer
 * @property [headers] - Requested header lines as Buffer
 */
declare type FetchMessageObject = {
    seq: number;
    uid: number;
    source?: Buffer;
    modseq?: bigint;
    emailId?: string;
    threadid?: string;
    labels?: Set<string>;
    size?: number;
    flags?: Set<string>;
    envelope?: MessageEnvelopeObject;
    bodyStructure?: MessageStructureObject;
    internalDate?: Date;
    bodyParts?: Map<string, Buffer>;
    headers?: Buffer;
};

/**
 * @property meta - content metadata
 * @property meta.contentType - Content-Type of the streamed file. If part was not set then this value is "message/rfc822"
 * @property [meta.charset] - Charset of the body part. Text parts are automaticaly converted to UTF-8, attachments are kept as is
 * @property [meta.disposition] - Content-Disposition of the streamed file
 * @property [meta.filename] - Filename of the streamed body part
 * @property content - Streamed content
 */
declare type DownloadObject = {
    meta: {
        contentType: string;
        charset?: string;
        disposition?: string;
        filename?: string;
    };
    content: ReadableStream;
};

