#define _GNU_SOURCE
#include <errno.h>
#include <sys/socket.h>

/* This library is loaded only for allow_network: false fixtures. Returning
 * EPERM from socket creation closes the common libc and libuv network paths
 * before a target can resolve or connect to a remote host. */
int socket(int domain, int type, int protocol) {
  (void)domain; (void)type; (void)protocol;
  errno = EPERM;
  return -1;
}

int socketpair(int domain, int type, int protocol, int sv[2]) {
  (void)domain; (void)type; (void)protocol; (void)sv;
  errno = EPERM;
  return -1;
}

int connect(int fd, const struct sockaddr *addr, socklen_t len) {
  (void)fd; (void)addr; (void)len;
  errno = EPERM;
  return -1;
}
