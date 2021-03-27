from miniwasp_hither import miniwasp_hither
import hither as hi

def main():
    import kachery_p2p as kp
    geom_uri = 'sha1://fce1fb4c8637a36edb34669e1ac612700ce7151e/lens_r01.go3'
    with hi.Config(container=True):
        j = miniwasp_hither.run(geom_uri=geom_uri)
        try:
            a = j.wait()
            print(a)
        except Exception as e:
            print('Error', e)
            j.print_console_out()

if __name__ == '__main__':
    main()