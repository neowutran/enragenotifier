# enragenotifier

Basic module for tera-proxy (https://github.com/meishuu/tera-proxy) to notify the user of boss enrage timings.

Module defaults to private state. In order to receive messages or change states you must create or join a private channel (see here: http://support.enmasse.com/tera/private-chat-channels).

To configure the module to display messages to a private chat, party notice, or to turn the module off, type **!private #** (where # = 1-8, defaults to private channel 1), **!notice**, or **!off** in a private channel.

**Note:** Only works on bosses with standard enrage timer (i.e. 36s enrage + 10% enrage after de-enrage) and doesn't work with multiple bosses (e.g. DF 1st boss)
