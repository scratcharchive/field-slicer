import os
import hither2 as hi
import kachery_p2p as kp
import numpy as np

thisdir = os.path.dirname(os.path.realpath(__file__))
@hi.function(
    'example4_hither', '0.1.0',
    image=hi.DockerImageFromScript(name='magland/miniwasp', dockerfile=f'{thisdir}/docker-miniwasp/Dockerfile'),
    kachery_support=True
)
def example4_hither(geom_uri: str, n_components: float=1, omega: float=3.141592*2/300.0, ppw = 10):
    import mwaspbie as mw
    import fmm3dbie as bie

    with kp.TemporaryDirectory() as tmpdir:
        geom_fname = kp.load_file(geom_uri, dest=f'{tmpdir}/geom.go3')
        surf_fname = f'{tmpdir}/surf.vtk'
        surfx_fname = f'{tmpdir}/surfx.vtk'
        surf_normals_fname = f'{tmpdir}/surf_normals.vtk'
        surf_znormals_fname = f'{tmpdir}/surf_znormals.vtk'
        jvals_fname = f'{tmpdir}/jvals.vtk'
        jvals_ex_fname = f'{tmpdir}/jvals_ex.vtk'
        kvals_fname = f'{tmpdir}/kvals.vtk'

        # compute number of patches and points
        npatches,npts = mw.em_solver_wrap_mem(geom_fname + '?', n_components)

        # Set translation and scaling of each component
        dP = np.zeros((4,n_components),order="F")
        dP[3,0] = 1.0

        eps = 1e-6

        # Get geometry info
        [npatches_vect,npts_vect,norders,ixyzs,iptype,srcvals,srccoefs,wts,
        sorted_vector,exposed_surfaces] = mw.em_solver_open_geom(geom_fname + '?', dP, npatches, npts,eps)

        # plot surface info (plots scalar field as z coordinate of the surface)
        bie.surf_vtk_plot(norders,ixyzs,iptype,srccoefs,srcvals,surf_fname,'a')

        # plot surface info with prescribed scalar field. We will use
        # x coordinate as a demo which is stored in srcvals[0,:]
        xvals = srcvals[0,:]
        bie.surf_vtk_plot_scalar(norders,ixyzs,iptype,srccoefs,srcvals,xvals, surfx_fname,'a')

        # plot surface info with real vector field. In this example we will
        # use the normals which are stored in srcvals[9:12,0:npts]

        normals = srcvals[9:12,0:npts]
        bie.surf_vtk_plot_vec(norders,ixyzs,iptype,srccoefs,srcvals,normals, surf_normals_fname,'a')


        # plot surface info with a complex vector field. In this example
        # we will use normals + 1j*[1,0,0]
        ztest = np.zeros(np.shape(normals),dtype='complex')
        ztest[0,:] = 1j
        ztest = ztest + normals
        bie.surf_vtk_plot_zvec(norders,ixyzs,iptype,srccoefs,srcvals,ztest, surf_znormals_fname,'a')

        # plot surface info with one of the tangential currents
        # which is the output soln of the subroutine em_solver_wrap
        # In this example we create a dummy solution whose real part is
        # the tangential projection of [1,0,0], and whose imaginary part 
        # is the tangential projection of [0,0.5,0] for the electric current
        # and the magnetic current is the tangential projection of 
        # [0,1,0] + 1j[0,0,0.5]
        # 
        #
        # In order to compute the tangential projections, we need
        # to obtain the orthonormal frame used in the construction
        # of the solution. This can be computed via the subroutine
        # orthonormalize_all
        #
        xu = srcvals[3:6,0:npts]
        [ru,rv] = bie.orthonormalize_all(xu,normals)
        soln = np.zeros(4*npts,dtype='complex')
        soln[0:npts] = ru[0,:] + 1j*ru[1,:]/2
        soln[npts:2*npts] = rv[0,:] + 1j*rv[1,:]/2
        soln[2*npts:3*npts] = ru[1,:] + 1j*ru[2,:]/2
        soln[3*npts:4*npts] = rv[1,:] + 1j*rv[2,:]/2

        # first plot electric current
        ifjk = 1
        mw.em_plot_surf_current_vtk(norders,ixyzs,iptype,srccoefs,srcvals,soln,ifjk,jvals_fname,'a')


        # Compare jvals to exact vector field by removing normal projection
        # from [1,0,0] + 1j*[0,0.5,0]

        jvals_ex = np.zeros((3,npts),dtype='complex')
        jvals_ex[0,:] = 1
        jvals_ex[1,:] = 0.5j
        rdot = jvals_ex[0,:]*normals[0,:] + jvals_ex[1,:]*normals[1,:] + jvals_ex[2,:]*normals[2,:]
        jvals_ex[0:3,:] = jvals_ex[0:3,:] - rdot*normals[0:3,:]
        bie.surf_vtk_plot_zvec(norders,ixyzs,iptype,srccoefs,srcvals,jvals_ex,jvals_ex_fname,'a')

        ifjk = 2
        mw.em_plot_surf_current_vtk(norders,ixyzs,iptype,srccoefs,srcvals,soln,ifjk,kvals_fname,'a')

        return {
            'surf': kp.store_file(surf_fname),
            'surfx': kp.store_file(surfx_fname),
            'surf_normals': kp.store_file(surf_normals_fname),
            'surf_znormals': kp.store_file(surf_znormals_fname),
            'jvals': kp.store_file(jvals_fname),
            'jvals_ex': kp.store_file(jvals_ex_fname),
            'kvals': kp.store_file(kvals_fname)
        }
