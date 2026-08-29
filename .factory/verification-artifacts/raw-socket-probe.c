#include <arpa/inet.h>
#include <errno.h>
#include <stdio.h>
#include <string.h>
#include <sys/syscall.h>
#include <unistd.h>

int main(void) {
  int fd = (int)syscall(SYS_socket, AF_INET, SOCK_STREAM, 0);
  if (fd < 0) {
    fprintf(stderr, "socket failed: %s\n", strerror(errno));
    return 3;
  }
  struct sockaddr_in address = {0};
  address.sin_family = AF_INET;
  address.sin_port = htons(18081);
  inet_pton(AF_INET, "127.0.0.1", &address.sin_addr);
  if (syscall(SYS_connect, fd, &address, sizeof(address)) < 0) {
    fprintf(stderr, "connect failed: %s\n", strerror(errno));
    return 4;
  }
  puts("NETWORK_CONNECTED_WITHOUT_OPT_IN");
  close(fd);
  return 0;
}
