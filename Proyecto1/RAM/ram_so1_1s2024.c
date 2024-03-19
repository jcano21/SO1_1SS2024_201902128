#include <linux/module.h>
#include <linux/proc_fs.h>
#include <linux/sysinfo.h> // ram 
#include <linux/seq_file.h>
#include <linux/mm.h>

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Jorge Cano");
MODULE_DESCRIPTION("Informacion de la RAM");
MODULE_VERSION("1.0");

struct sysinfo inf;

static int escribir_a_proc(struct seq_file *file_proc, void *v)
{
    unsigned long total, used, notused,free;
    unsigned long porc;
    si_meminfo(&inf);

    total = (inf.totalram * inf.mem_unit) / (1024*1024);
    free = (inf.freeram * inf.mem_unit) / (1024*1024);
    used = total - free;
    porc = (used * 100) / total;
    
    notused = total - used;
    seq_printf(file_proc, "{\"totalRam\":%lu, \"memoriaEnUso\":%lu, \"porcentaje\":%lu, \"libre\":%lu }", total, used, porc, notused);
    return 0;
}


static int abrir_aproc(struct inode *inode, struct file *file)
{
    return single_open(file, escribir_a_proc, NULL);
}

static struct proc_ops archivo_operaciones = {
    .proc_open = abrir_aproc,
    .proc_read = seq_read
};

static int __init modulo_init(void)
{
    proc_create("ram_so1_1s2024", 0, NULL, &archivo_operaciones);
    printk(KERN_INFO "Modulo RAM montado\n");
    return 0;
}

static void __exit modulo_cleanup(void)
{
    remove_proc_entry("ram_so1_1s2024", NULL);
    printk(KERN_INFO "Modulo RAM eliminado \n");
}

module_init(modulo_init);
module_exit(modulo_cleanup);

// ----------- sudo dmesg -C    limpia la consola
// ----------- sudo dmesg       muestra los mensajes